const express = require('express')
const router = express.Router()
const shopController = require('../../controllers/shop-controller')
const { authenticated, isBuyer, isSeller } = require('../../middlewares/auth')

router.get('/:shopId', shopController.getShops)

router.post('/', authenticated, isSeller, shopController.newShops)
router.put('/:shopId', authenticated, isSeller, shopController.putShops)
router.delete('/:shopId', authenticated, isSeller, shopController.deleteShops)
router.get(
  '/:shopId/records',
  authenticated,
  isSeller,
  shopController.getSalesRecord
)

module.exports = router
