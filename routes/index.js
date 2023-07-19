const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const launched_ps = require('./modules/launched_ps')
const { authenticated, isBuyer, isSeller } = require('../middlewares/auth')

router.use('/api/v1/users', users)
router.use('/api/v1/launched_ps', launched_ps)

router.get('/', (req, res) => {
  res.send('hello home page')
})

module.exports = router
