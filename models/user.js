'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Cart, { foreignKey: 'userId' })
      User.hasMany(models.Shop, { foreignKey: 'userId' })
      User.hasMany(models.Ship_info, { foreignKey: 'userId' })
      User.hasMany(models.Order_info, { foreignKey: 'userId' })
      User.hasMany(models.Order, { foreignKey: 'userId' })
    }
  }
  User.init(
    {
      account: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      role: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true
    }
  )
  return User
}
