const jwt = require('jsonwebtoken')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '7d'
      })
      res.json({
        status: success,
        data: { token },
        user: req.user
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
