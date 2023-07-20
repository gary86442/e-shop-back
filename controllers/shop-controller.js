const { User, Shop, Product } = require('../models')
const { getUser } = require('../helper/helper')
const shopController = {
  //* 新增商店
  newShops: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      if (currentUser.role !== 'seller') throw new Error('登入的人不是賣家')
      const { name, description } = req.body
      if (!name || !description) throw new Error('店名和商店簡介不可以空白')
      const newShop = await Shop.create({
        name,
        description,
        user_id: currentUser.id
      })
      return res.status(200).json({ status: 'success', shop: newShop })
    } catch (err) {
      next(err)
    }
  },
  //* 修改商店
  putShops: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      const { shopId } = req.params
      const { name, description } = req.body
      const shop = await Shop.findByPk(shopId)
      if (shop.user_id !== currentUser.id) throw new Error('店主與使用者不相符')
      const newShop = await shop.update({
        name,
        description
      })
      return res.status(200).json({ status: 'success', shop: newShop })
    } catch (err) {
      next(err)
    }
  },
  //* 查商店
  getShops: async (req, res, next) => {
    try {
      const { shopId } = req.params
      const shop = await Shop.findByPk(shopId)
      if (!shop) throw new Error('找不到到該商店')

      return res.status(200).json({ status: 'success', shop })
    } catch (err) {
      next(err)
    }
  },
  //* 關商店
  deleteShops: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      const { shopId } = req.params
      const shop = await Shop.findByPk(shopId)
      if (shop.user_id !== currentUser.id) throw new Error('店主與使用者不相符')
      const deleteShop = await shop.destroy()
      return res.status(200).json({ status: 'success', shop: deleteShop })
    } catch (err) {
      next(err)
    }
  },
  //todo 銷售紀錄
  getSalesRecord: async (req, res, next) => {
    try {
      const currentUser = getUser(req)

      return res.status(200).json({ status: 'success', user: userData })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = shopController
