'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order_info extends Model {
    static associate(models) {
      Order_info.belongsTo(models.Ship_info, { foreignKey: 'shipInfoId' })
      Order_info.belongsTo(models.User, { foreignKey: 'userId' })
      Order_info.hasMany(models.Order, { foreignKey: 'orderInfoId' })
    }
  }
  Order_info.init(
    {
      user_id: DataTypes.INTEGER,
      ship_info_id: DataTypes.INTEGER,
      pay_status: { type: DataTypes.BOOLEAN, defaultValue: false }
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
