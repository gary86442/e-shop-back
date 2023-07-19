const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { getUser } = require('../helper/helper')
const sellerController = {
  //! 賣家的帳號編輯使用和USER相同
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

      //todo 待設定password, name, account
      const user = await User.findOne({ where: { account, role: 'seller' } })
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
  sellerLogin: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account | !password) throw new Error('帳號和密碼是必須要填寫！')
      const user = await User.findOne({ where: { account, role: 'seller' } })
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

module.exports = sellerController
