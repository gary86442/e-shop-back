const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
//*login and register
router.post('/login', userController.login)
// router.post('/', userController.register)

module.exports = router
