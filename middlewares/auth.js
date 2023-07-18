const passport = require('../config/passport')

//* 驗證 ROLE
const checkUserRole = role => (req, res, next) => {
  if (req.user) {
    if (req.user.role === role) {
      return next()
    } else {
      return res.status(403).json({ message: `只有${role}可以進入` })
    }
  } else {
    return res.status(401).json({ message: '請先登入' })
  }
}

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (user) {
      // 因應測試檔，我們手動將驗證後找到的user塞到req中
      req.user = user.dataValues
      return next()
    }
    return res.status(401).json({ message: '請先登入' })
  })(req, res, next)
}

module.exports = {
  authenticated,
  isBuyer: checkUserRole('buyer'),
  isSeller: checkUserRole('seller')
}
