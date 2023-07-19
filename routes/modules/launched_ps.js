const express = require('express')
const router = express.Router()
const launched_pController = require('../../controllers/launched_p-controller')
const { authenticated, isBuyer, isSeller } = require('../../middlewares/auth')
//* 取得商品
router.get('/', launched_pController.getLaunched_p)

module.exports = router
