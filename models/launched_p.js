'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Launched_p extends Model {
    static associate(models) {
      Launched_p.hasMany(models.Order, { foreignKey: 'launchedPId' })
      Launched_p.belongsTo(models.Product, { foreignKey: 'productId' })
      Launched_p.hasMany(models.Cart, { foreignKey: 'launchedPId' })
    }
  }
  Launched_p.init(
    {
      product_id: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      is_selling: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {
      sequelize,
      modelName: 'Launched_p',
      tableName: 'Launched_ps',
      underscored: true
    }
  )
  return Launched_p
}
