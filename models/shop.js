'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shop.hasMany(models.Product, { foreignKey: 'shopId' })
      Shop.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Shop.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      user_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Shop',
      tableName: 'Shops',
      underscored: true
    }
  )
  return Shop
}
