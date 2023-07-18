const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
//*login and register
router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/seller/login', userController.sellerLogin)
router.post('/seller/register', userController.sellerRegister)

module.exports = router
