const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Ship_info, Order_info, Order, Launched_p } = require('../models')
const { getUser } = require('../helper/helper')
const userController = {
  //* 瀏覽全部上架產品
  getLaunched_p: async (req, res, next) => {
    try {
      const Launched_ps = await Launched_p.findAll({
        WHERE: { isSelling: true },
        attributes: { exclude: ['productId', 'launchedPId'] }
      })
      const currentUser = getUser(req)

      return res.status(200).json({ status: 'success', data: { Launched_ps } })
    } catch (err) {
      next(err)
    }
  },
  //todo 新增上架產品
  postLaunched_p: async (req, res, next) => {
    try {
      const Launched_ps = await Launched_p.findAll({
        WHERE: { isSelling: true },
        attributes: { exclude: ['productId', 'launchedPId'] }
      })
      const currentUser = getUser(req)

      return res.status(200).json({ status: 'success', data: { Launched_ps } })
    } catch (err) {
      next(err)
    }
  },
  //todo 修改上架產品
  putLaunched_p: async (req, res, next) => {
    try {
      const Launched_ps = await Launched_p.findAll({
        WHERE: { isSelling: true },
        attributes: { exclude: ['productId', 'launchedPId'] }
      })
      const currentUser = getUser(req)

      return res.status(200).json({ status: 'success', data: { Launched_ps } })
    } catch (err) {
      next(err)
    }
  },
  //todo 刪除上架產品
  deleteLaunched_p: async (req, res, next) => {
    try {
      const Launched_ps = await Launched_p.findAll({
        WHERE: { isSelling: true },
        attributes: { exclude: ['productId', 'launchedPId'] }
      })
      const currentUser = getUser(req)

      return res.status(200).json({ status: 'success', data: { Launched_ps } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
