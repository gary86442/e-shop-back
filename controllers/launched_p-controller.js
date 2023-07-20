const { Product, Launched_p, Shop } = require('../models')
const { getUser } = require('../helper/helper')
//* 檢查店主身分
const checkShopKeeper = async req => {
  const currentUser = getUser(req)
  const { shopId } = req.body
  const shop = await Shop.findByPk(shopId)
  if (shop.user_id !== currentUser.id)
    throw new Error('登入者不是店主，無法查看商品資訊')
}
const launched_pController = {
  getLaunched_p: async (req, res, next) => {
    try {
      const { launchedPId } = req.params
      console.log(launchedPId)
      const launched_p = await Launched_p.findByPk(launchedPId, {
        attributes: { exclude: ['productId', 'launchedPId'] },
        include: {
          model: Product,
          attributes: ['id', 'name', 'description', 'image', 'category_id']
        }
      })
      console.log(launched_p)
      if (!launched_p.is_selling) throw new Error('商品不在架上')
      return res.status(200).json({ status: 'success', data: { launched_p } })
    } catch (err) {
      next(err)
    }
  },
  //* 瀏覽全部上架產品
  getAllLaunched_ps: async (req, res, next) => {
    try {
      const Launched_ps = await Launched_p.findAll({
        WHERE: { is_selling: true },
        attributes: { exclude: ['productId', 'launchedPId'] },
        include: {
          model: Product,
          attributes: ['id', 'name', 'description', 'image', 'category_id']
        }
      })
      return res.status(200).json({ status: 'success', data: { Launched_ps } })
    } catch (err) {
      next(err)
    }
  },

  // 新增多筆上架產品
  newLaunched_ps: async (req, res, next) => {
    try {
      // 確認店主
      checkShopKeeper(req)
      const { launched_ps, shopId } = req.body

      //確認要上架商品屬於該店
      for (let product of launched_ps) {
        const existProduct = await Product.findByPk(product.product_id, {
          WHERE: { shop_id: shopId }
        })
        if (!existProduct)
          throw new Error(`${existProduct.name}，該店家沒有這項商品。`)
      }

      const newLaunched_ps = await Launched_p.bulkCreate(launched_ps)
      return res
        .status(200)
        .json({ status: 'success', data: { launched_ps: newLaunched_ps } })
    } catch (err) {
      next(err)
    }
  },
  //* 修改上架產品
  putLaunched_p: async (req, res, next) => {
    try {
      // 確認店主
      checkShopKeeper(req)
      const { price, stock } = req.body
      const { launchedPId } = req.params

      const launched_p = await Launched_p.findByPk(launchedPId, {
        WHERE: { is_selling: true },
        attributes: { exclude: ['productId', 'launchedPId'] }
      })
      const newLaunched_p = await launched_p.update({ price, stock })
      if (!launched_p) throw new Error('上架商品不存在')

      return res
        .status(200)
        .json({ status: 'success', data: { launched_p: newLaunched_p } })
    } catch (err) {
      next(err)
    }
  },
  //todo 刪除上架產品(把isselling改成 false)
  deleteLaunched_ps: async (req, res, next) => {
    try {
      // 確認店主
      checkShopKeeper(req)
      const { launchedPId } = req.params
      const launched_p = await Launched_p.findOne({
        WHERE: { id: launched_p_id, is_selling: true },
        attributes: { exclude: ['productId', 'launchedPId'] }
      })
      if (!launched_p) throw new Error('上架商品不存在')
      const deleteLaunched_p = await launched_p.update({ is_selling: false })

      return res
        .status(200)
        .json({ status: 'success', data: { launched_p: deleteLaunched_p } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = launched_pController
