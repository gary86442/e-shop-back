'use strict'
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE role = "buyer"',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )
      const launched_ps = await queryInterface.sequelize.query(
        'SELECT id FROM Launched_ps ',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )

      const cart_products = []
      for (let user of users) {
        cart_products.push(
          {
            user_id: user.id,
            launched_p_id:
              launched_ps[Math.floor(Math.random() * launched_ps.length)].id,
            qty: faker.number.int({ min: 1, max: 5 }),
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            user_id: user.id,
            launched_p_id:
              launched_ps[Math.floor(Math.random() * launched_ps.length)].id,
            qty: faker.number.int({ min: 1, max: 5 }),
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            user_id: user.id,
            launched_p_id:
              launched_ps[Math.floor(Math.random() * launched_ps.length)].id,
            qty: faker.number.int({ min: 1, max: 5 }),
            created_at: new Date(),
            updated_at: new Date()
          }
        )
      }

      await queryInterface.bulkInsert('Carts', cart_products, {})
    } catch (err) {
      console.log(err)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carts', {})
  }
}
