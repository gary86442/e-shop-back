'use strict'
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const products = await queryInterface.sequelize.query(
        'SELECT id FROM Products ',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )

      const launched_ps = []
      for (let product of products) {
        launched_ps.push({
          product_id: product.id,
          price: faker.commerce.price({ min: 100, max: 999, dec: 0 }),
          stock: faker.number.int({ min: 10, max: 100 }),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
      await queryInterface.bulkInsert('Launched_ps', launched_ps, {})
    } catch (err) {
      console.log(err)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Launched_ps', {})
  }
}
