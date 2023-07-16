'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.Launched_p, { foreignKey: 'launchedPId' })
      Product.belongsTo(models.Shop, { foreignKey: 'shopId' })
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' })
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      shop_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products'
    }
  )
  return Product
}
