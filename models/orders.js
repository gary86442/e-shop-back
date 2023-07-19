'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Launched_p, { foreignKey: 'launchedPId' })
      Order.belongsTo(models.Order_info, { foreignKey: 'orderInfoId' })
    }
  }
  Order.init(
    {
      order_info_id: DataTypes.INTEGER,
      launched_p_id: DataTypes.INTEGER,
      launched_p_qty: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders',
      underscored: true
    }
  )
  return Order
}
