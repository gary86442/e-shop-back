const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const userController = {
  // register: (req,res,next)={},
  login: async (req, res, next) => {
    try {
      const { account, password } = req.body
      console.log(account, password)
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
  }
}

module.exports = userController
