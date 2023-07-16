'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.Launched_p, { foreignKey: 'launchedPId' })
      Order.belongsTo(models.Order_info, { foreignKey: 'orderId' })
    }
  }
  Order.init(
    {
      launched_p_id: DataTypes.INTEGER,
      launched_p_qty: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders'
    }
  )
  return Order
}
