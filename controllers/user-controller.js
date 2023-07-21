const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Ship_info, Order_info, Order, Launched_p } = require('../models')
const { getUser } = require('../helper/helper')
const userController = {
  //* 消費者驗證
  register: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      // Error: 密碼不相符
      if (password !== checkPassword) throw new Error('密碼與確認密碼不同')
      // Error: 必填項目
      if (!account || account.trim() === '') throw new Error('帳號為必填項目')
      if (!email || email.trim() === '') throw new Error('Email為必填項目')
      if (!password || password.trim() === '') throw new Error('密碼為必填項目')
      // Error: 字數限制
      if (account.length > 20) throw new Error('Account 欄位上限 20 字')
      if (name.length > 50) throw new Error('Name 欄位上限 50 字')

      // 待設定password, name, account
      const user = await User.findOne({ where: { account, role: 'buyer' } })
      if (user) throw new Error('account已重複註冊')
      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        account,
        email,
        password: hash,
        role: 'buyer'
      })

      const userData = newUser.toJSON()
      delete userData.password
      return res.status(200).json({ status: 'success', user: userData })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account | !password) throw new Error('帳號和密碼是必須要填寫！')
      const user = await User.findOne({ where: { account, role: 'buyer' } })
      if (!user) throw new Error('使用者不存在')
      if (user.role === 'seller') throw new Error('請到店家登入頁面登入')
      if (!bcrypt.compareSync(password, user.password))
        throw new Error('密碼錯誤')
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '7d'
      })
      return res.status(200).json({
        status: 'success',
        data: { token },
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  //* 消費者帳號管理
  getProfile: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      const userData = await User.findByPk(currentUser.id, {
        attributes: { exclude: ['password'] }
      })
      return res.status(200).json({
        status: 'success',
        data: { user: userData }
      })
    } catch (err) {
      next(err)
    }
  },
  putProfile: async (req, res, next) => {
    //TODO 製作修改密碼：確認密碼 才可以修正。
    const { name, email, address, phone } = req.body
    const currentUser = getUser(req)
    const userData = await User.findByPk(currentUser.id)
    if (!userData) throw new Error('使用者不存在')
    const newProfile = {
      name: name || userData.name,
      email: email || userData.email,
      address: address || userData.address,
      phone: phone || userData.phone
    }
    await userData.update(newProfile)
    return res.status(200).json({
      staus: 'success',
      data: {
        user: newProfile
      }
    })
  },

  //* Ship info 管理
  getAddress: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      const infos = await Ship_info.findAll({
        where: { user_id: currentUser.id },
        attributes: { exclude: ['userId'] }
      })
      //? 目前得到的結果會多一個userId的欄位?   先用語法排除

      return res
        .status(200)
        .json({ status: 'success', data: { ship_infos: infos } })
    } catch (err) {
      next(err)
    }
  },
  postAddress: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      let { phone, address, name } = req.body
      ;[phone, address, name] = [phone, address, name].map(item => item.trim())
      if (!phone || !address || !name)
        throw new Error('收件人、地址、電話都為必填項目')
      const newInfo = await Ship_info.create({
        user_id: currentUser.id,
        phone,
        name,
        address
      })
      return res
        .status(200)
        .json({ status: 'success', data: { ship_infos: newInfo } })
    } catch (err) {
      next(err)
    }
  },
  putAddress: async (req, res, next) => {
    try {
      const { addressId } = req.params
      let { phone, address, name } = req.body
      ;[phone, address, name] = [phone, address, name].map(item => item.trim())
      if (!phone || !address || !name)
        throw new Error('收件人、地址、電話都為必填項目')
      const shipInfo = await Ship_info.findByPk(addressId)
      if (!shipInfo) throw new Error('該寄件資訊不存在')
      const newInfo = await shipInfo.update({
        phone,
        name,
        address
      })
      return res
        .status(200)
        .json({ status: 'success', data: { ship_infos: newInfo } })
    } catch (err) {
      next(err)
    }
  },
  deleteAddress: async (req, res, next) => {
    try {
      const { addressId } = req.params
      const shipInfo = await Ship_info.findByPk(addressId)
      if (!shipInfo) throw new Error('該寄件資訊不存在')
      const deleteInfo = await shipInfo.destroy()
      return res
        .status(200)
        .json({ status: 'success', data: { ship_infos: deleteInfo } })
    } catch (err) {
      next(err)
    }
  },

  //* 查看購買紀錄
  getUserOrders: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      const orders = await Order_info.findAll({
        where: { user_id: currentUser.id },
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['userId', 'shipInfoId'] },
        include: {
          model: Order,
          attributes: ['id', 'launched_p_id', 'launched_p_qty'],
          include: { model: Launched_p, attributes: ['id', 'price'] }
        }
      })
      return res.status(200).json({ status: 'success', data: { orders } })
    } catch (err) {
      next(err)
    }
  },
  //* 新增訂單
  newOrder: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      const { ship_info_id, orders } = req.body
      // 陣列 查詢上架商品資料庫以新增購買商品的陣列、檢查內容、 庫存數量是否足夠購買、如果足夠就建立ORDERS並回傳，有不足的篩選出來，並回傳前端，停止建立ORDERS。
      orders.map(async order => {
        const launched_p = await Launched_p.findByPk(order.launched_p_id, {
          attributes: { exclude: ['launchedPId'] }
        })
        if (!launched_p)
          throw new Error(`${order.launched_p_id}該上架商品不存在`)
        if (!launched_p.is_selling)
          throw new Error(`${order.launched_p_id}該上架商品已經下架`)
        if (launched_p.stock < order.qty)
          throw new Error(`${order.launched_p_id}庫存量不足`)
      })
      // 抓取SHIPINFO 驗證是否屬於使用者
      const shipInfo = await Ship_info.findByPk(ship_info_id)
      if (!shipInfo) throw new Error('該寄件資訊不存在')
      if (shipInfo.user_id !== currentUser.id)
        throw new Error('寄件資訊與登入使用者不符')
      // 建立新的ORDERINFO
      const newOrderInfo = await Order_info.create({
        ship_info_id,
        user_id: currentUser.id
      })

      //庫存減少
      for (let order of orders) {
        const launched_p = await Launched_p.findByPk(order.launched_p_id, {
          attributes: { exclude: ['launchedPId'] }
        })

        const newStock = launched_p.stock - order.qty
        await launched_p.update({ stock: newStock })
      }
      //建立新的訂單
      const newOrders = await Order.bulkCreate(
        orders.map(order => {
          return {
            launched_p_id: order.launched_p_id,
            order_info_id: newOrderInfo.id,
            launched_p_qty: order.qty
          }
        })
      )

      return res.status(200).json({ status: 'success', data: { newOrders } })
    } catch (err) {
      next(err)
    }
  },
  //todo 取消訂單
  deleteOrder: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      const orders = await Order_info.findAll({
        where: { user_id: currentUser.id },
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['userId', 'shipInfoId'] },
        include: {
          model: Order,
          attributes: ['id', 'launched_p_id', 'launched_p_qty'],
          include: { model: Launched_p, attributes: ['id', 'price'] }
        }
      })
      return res.status(200).json({ status: 'success', data: { orders } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
