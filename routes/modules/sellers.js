const express = require('express')
const router = express.Router()
const sellerController = require('../../controllers/seller-controller')
const userController = require('../../controllers/user-controller')
const { authenticated, isBuyer, isSeller } = require('../../middlewares/auth')
//*buyer login, register, profile
router.post('/login', sellerController.sellerLogin)
router.post('/register', sellerController.sellerRegister)
router.get('/profile', authenticated, userController.getProfile)
router.put('/profile', authenticated, userController.putProfile)

module.exports = router
