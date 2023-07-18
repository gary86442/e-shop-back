'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Launched_p extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Launched_p.belongsTo(models.Product, { foreignKey: 'productId' })
      Launched_p.belongsTo(models.Cart, { foreignKey: 'launchedPId' })
    }
  }
  Launched_p.init(
    {
      product_id: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      isSelling: DataTypes.BOOLEAN
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
