'use strict'
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const shops = await queryInterface.sequelize.query(
        'SELECT id FROM Shops ',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )
      const categories = await queryInterface.sequelize.query(
        'SELECT id FROM Categories ',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )

      const products = []
      for (let shop of shops) {
        for (let i = 0; i < 10; i++) {
          products.push({
            name: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            category_id:
              categories[Math.floor(Math.random() * categories.length)].id,
            shop_id: shop.id,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }
      await queryInterface.bulkInsert('Products', products, {})
    } catch (err) {
      console.log(err)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', {})
  }
}
