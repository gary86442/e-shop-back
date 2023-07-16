'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order_info.hasOne(models.Ship_info, { foreignKey: 'shipInfoId' })
      Order_info.belongsTo(models.User, { foreignKey: 'userId' })
      Order_info.hasMany(models.Order, { foreignKey: 'orderId' })
    }
  }
  Order_info.init(
    {
      user_id: DataTypes.INTEGER,
      ship_id: DataTypes.INTEGER,
      order_id: DataTypes.INTEGER,
      pay_status: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Order_info',
      tableName: 'Order_infos',
      underscored: true
    }
  )
  return Order_info
}
