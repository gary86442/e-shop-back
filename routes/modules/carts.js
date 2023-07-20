const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart-controller')

//* 購物車 CRUD
router.get('/', cartController.getAllCart)
router.post('/', cartController.newCart)
router.put('/:cart_id', cartController.putCart)
router.delete('/:cart_id', cartController.deleteCart)
router.delete('/', cartController.emptyCart)

module.exports = router
