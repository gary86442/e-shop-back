const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const { authenticated, isBuyer, isSeller } = require('../middlewares/auth')

router.use('/api/v1/users', users)

router.get('/', (req, res) => {
  res.send('hello home page')
})

module.exports = router
