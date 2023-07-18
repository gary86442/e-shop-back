'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'userId' })
      Cart.hasMany(models.Launched_p, { foreignKey: 'launchedPId' })
    }
  }
  Cart.init(
    {
      user_id: DataTypes.INTEGER,
      lunched_p_id: DataTypes.INTEGER,
      qty: DataTypes.INTEGER
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
