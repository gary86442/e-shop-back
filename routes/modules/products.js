const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product-controller')

//* 產品 CRUD
router.get('/:productId', productController.getProduct)

router.post('/', productController.newProduct)
router.put('/:productId', productController.putProduct)
router.delete('/:productId', productController.deleteProduct)

//* 取得全部商品
router.get('/', productController.getAllProduct)

module.exports = router
