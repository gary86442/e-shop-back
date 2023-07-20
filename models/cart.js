'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'userId' })
      Cart.belongsTo(models.Launched_p, { foreignKey: 'launchedPId' })
    }
  }
  Cart.init(
    {
      user_id: DataTypes.INTEGER,
      launched_p_id: DataTypes.INTEGER,
      qty: { type: DataTypes.INTEGER, defaultValue: 1 }
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'Carts',
      underscored: true
    }
  )
  return Cart
}
