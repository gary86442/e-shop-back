const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated, isBuyer, isSeller } = require('../../middlewares/auth')
//*buyer login, register, profile
router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/profile', authenticated, isBuyer, userController.getProfile)
router.put('/profile', authenticated, isBuyer, userController.putProfile)

//*   使用者寄件資訊
router.get('/address', authenticated, isBuyer, userController.getAddress)
router.post('/address', authenticated, isBuyer, userController.postAddress)
router.put(
  '/address/:addressId',
  authenticated,
  isBuyer,
  userController.putAddress
)
router.delete(
  '/address/:addressId',
  authenticated,
  isBuyer,
  userController.deleteAddress
)
//* 購買紀錄
router.get('/purchase')

//* seller login, register, profile
router.post('/seller/login', userController.sellerLogin)
router.post('/seller/register', userController.sellerRegister)

module.exports = router
