const { Product, Launched_p, Cart, User } = require('../models')
const { getUser } = require('../helper/helper')
//* 檢查店主身分

const cartController = {
  //todo 瀏覽購物車內所有商品
  getAllCart: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      // 用現在USERID找購物車內容
      const p_in_cart = await Cart.findAll({
        where: { user_id: currentUser.id },
        attributes: { exclude: ['userId', 'launchedPId'] },
        include: {
          model: Launched_p,
          attributes: ['price', 'product_id', 'is_selling']
        }
      })
      // 判斷是否架上，沒有的話更新最新的(未上架的也會提供)
      for (let i = 0; i < p_in_cart.length; i++) {
        if (!p_in_cart[i].Launched_p.is_selling) {
          const newLaunched_p = await Launched_p.findOne({
            where: { product_id: p_in_cart[i].Launched_p.product_id },
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['userId', 'launchedPId'] }
          })
          p_in_cart.splice(i, 1, newLaunched_p)
        }
      }
      return res
        .status(200)
        .json({ status: 'success', data: { products: p_in_cart } })
    } catch (err) {
      next(err)
    }
  },

  //* 新增至購物車
  newCart: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      const { launched_p_id } = req.body
      const launched_p = await Launched_p.findByPk(launched_p_id, {
        attributes: { exclude: ['userId', 'launchedPId'] }
      })
      if (!launched_p) throw new Error('找不到該商品')
      if (!launched_p.is_selling) throw new Error('該商品沒有上架')
      const new_p_in_cart = await Cart.create({
        user_id: currentUser.id,
        launched_p_id
      })
      return res
        .status(200)
        .json({ status: 'success', data: { cart_product: new_p_in_cart } })
    } catch (err) {
      next(err)
    }
  },
  //* 修改購物車內容
  putCart: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      const { cart_id } = req.params
      const { qty } = req.body
      const cart = await Cart.findByPk(cart_id, {
        attributes: { exclude: ['userId', 'launchedPId'] }
      })

      if (!cart) throw new Error('該品項不存在')
      if (cart.user_id !== currentUser.id)
        throw new Error('購物車主人與使用者不相符')

      const new_cart = await cart.update({
        qty
      })
      return res
        .status(200)
        .json({ status: 'success', data: { cart_product: new_cart } })
    } catch (err) {
      next(err)
    }
  },
  //* 將上架商品移出購物車
  deleteCart: async (req, res, next) => {
    try {
      const currentUser = getUser(req)
      const { cart_id } = req.params
      const cart = await Cart.findByPk(cart_id, {
        attributes: { exclude: ['userId', 'launchedPId'] }
      })
      if (!cart) throw new Error('該品項不存在')
      if (cart.user_id !== currentUser.id)
        throw new Error('購物車主人與使用者不相符')

      const delete_cart = await cart.destroy()
      return res
        .status(200)
        .json({ status: 'success', data: { cart_product: delete_cart } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = cartController
