const { Product, Shop } = require('../models')
const { getUser } = require('../helper/helper')
//* 檢查店主身分
const checkShopKeeper = async req => {
  const currentUser = getUser(req)
  const { shopId } = req.body
  const shop = await Shop.findByPk(shopId)
  if (shop.user_id !== currentUser.id)
    throw new Error('登入者不是店主，無法查看商品資訊')
}
const productController = {
  //* 取得產品詳細資訊
  getProduct: async (req, res, next) => {
    try {
      const { productId } = req.params
      //確認店主
      checkShopKeeper(req)
      const { shopId } = req.body
      const product = await Product.findByPk(productId)
      if (!product) throw new Error('產品不存在')
      if (product.shop_id !== Number(shopId))
        throw new Error('產品的店家ID和登入賣家的店家不相符')
      return res.status(200).json({ status: 'success', data: { product } })
    } catch (err) {
      next(err)
    }
  },
  //* 取得所有產品資訊
  getAllProduct: async (req, res, next) => {
    try {
      checkShopKeeper(req)
      const products = await Product.findAll({
        where: { shop_id: req.body.shopId },
        attributes: { exclude: ['shopId'] },
        order: [['updatedAt', 'DESC']]
      })

      return res.status(200).json({ status: 'success', data: { products } })
    } catch (err) {
      next(err)
    }
  },
  //* 新增店家產品
  newProduct: async (req, res, next) => {
    try {
      //確認店主
      checkShopKeeper(req)
      const { shopId, name, description, image, category_id } = req.body
      if (!name || !description) throw new Error('產品名稱及說明不可以為空白')
      if (name.length > 20 || description.length > 100)
        throw new Error('產品名稱長度不可大於20且說明長度不可以大於100')
      const product = await Product.create({
        name,
        description,
        image: image || null,
        category_id,
        shop_id: shopId
      })

      return res.status(200).json({ status: 'success', data: { product } })
    } catch (err) {
      next(err)
    }
  },
  //* 修改店家產品
  putProduct: async (req, res, next) => {
    try {
      //確認店主
      checkShopKeeper(req)
      const { productId } = req.params
      const { shopId, name, description, image, category_id } = req.body
      if (!name || !description) throw new Error('產品名稱及說明不可以為空白')
      if (name.length > 20 || description.length > 100)
        throw new Error('產品名稱長度不可大於20且說明長度不可以大於100')

      const product = await Product.findByPk(productId)
      if (!product) throw new Error('產品不存在')
      if (product.shop_id !== Number(shopId))
        throw new Error('產品的店家ID和登入賣家的店家不相符')

      const newProduct = await product.update({
        name,
        description,
        image: image || null,
        category_id,
        shop_id: shopId
      })

      return res
        .status(200)
        .json({ status: 'success', data: { product: newProduct } })
    } catch (err) {
      next(err)
    }
  },
  //* 刪除店家產品
  deleteProduct: async (req, res, next) => {
    try {
      //確認店主
      checkShopKeeper(req)
      const { shopId } = req.body
      const { productId } = req.params
      const product = await Product.findByPk(productId)
      if (!product) throw new Error('產品不存在')
      if (product.shop_id !== Number(shopId))
        throw new Error('產品的店家ID和登入賣家的店家不相符')
      const deleteProduct = await product.destroy()

      return res
        .status(200)
        .json({ status: 'success', data: { product: deleteProduct } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = productController
