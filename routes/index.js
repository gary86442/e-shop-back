const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const launched_ps = require('./modules/launched_ps')
const shops = require('./modules/shops')
const sellers = require('./modules/sellers')
const products = require('./modules/products')
const carts = require('./modules/carts')
const { authenticated, isBuyer, isSeller } = require('../middlewares/auth')
const { apiErrorHandler } = require('../middlewares/error-handler')
//* 允許所有網域訪問
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

router.use('/api/v1/users', users)
router.use('/api/v1/sellers', sellers)
router.use('/api/v1/launched_ps', launched_ps)
router.use('/api/v1/products', authenticated, isSeller, products)
router.use('/api/v1/shops', shops)
router.use('/api/v1/carts', authenticated, isBuyer, carts)

router.use('/', apiErrorHandler)
module.exports = router
