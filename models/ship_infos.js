'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Ship_info extends Model {
    static associate(models) {
      Ship_info.belongsTo(models.User, { foreignKey: 'userId' })
      Ship_info.hasMany(models.Order_info, { foreignKey: 'shipInfoId' })
    }
  }
  Ship_info.init(
    {
      user_id: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Ship_info',
      tableName: 'Ship_infos',
      underscored: true
    }
  )
  return Ship_info
}
