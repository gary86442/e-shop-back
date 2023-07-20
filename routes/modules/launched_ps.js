const express = require('express')
const router = express.Router()
const launched_pController = require('../../controllers/launched_p-controller')
const { authenticated, isSeller } = require('../../middlewares/auth')
//* 取得上架商品
router.get('/:launchedPId', launched_pController.getLaunched_p)
router.get('/', launched_pController.getAllLaunched_ps)
router.post('/', authenticated, isSeller, launched_pController.newLaunched_ps)
router.put(
  '/:launchedPId',
  authenticated,
  isSeller,
  launched_pController.putLaunched_p
)
router.delete(
  '/:launchedPId',
  authenticated,
  isSeller,
  launched_pController.deleteLaunched_ps
)

module.exports = router
