const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Ship_info } = require('../models')
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
      const user = await User.findOne({ where: { account } })
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
      const user = await User.findOne({ where: { account } })
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

  //* 賣家驗證

  sellerRegister: async (req, res, next) => {
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
      const user = await User.findOne({ where: { account } })
      if (user) throw new Error('account已重複註冊')
      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        account,
        email,
        password: hash,
        role: 'seller'
      })

      const userData = newUser.toJSON()
      delete userData.password
      return res.status(200).json({ status: 'success', user: userData })
    } catch (err) {
      next(err)
    }
  },
  // register: (req,res,next)={},
  sellerLogin: async (req, res, next) => {
    try {
      const { account, password } = req.body
      console.log(account, password)
      if (!account | !password) throw new Error('帳號和密碼是必須要填寫！')
      const user = await User.findOne({ where: { account } })
      if (!user) throw new Error('使用者不存在')
      if (user.role === 'buyer') throw new Error('請到消費者頁面登入')
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
  }
}

module.exports = userController
