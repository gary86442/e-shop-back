'use strict'
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const launched_ps = await queryInterface.sequelize.query(
        'SELECT id FROM Launched_ps ',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )
      const orderInfos = await queryInterface.sequelize.query(
        'SELECT id FROM Order_infos',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )
      const orders = []
      for (let orderInfo of orderInfos) {
        orders.push(
          {
            order_info_id: orderInfo.id,
            launched_p_id:
              launched_ps[Math.floor(Math.random() * launched_ps.length)].id,
            launched_p_qty: faker.number.int({ min: 1, max: 5 }),
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            order_info_id: orderInfo.id,
            launched_p_id:
              launched_ps[Math.floor(Math.random() * launched_ps.length)].id,
            launched_p_qty: faker.number.int({ min: 1, max: 5 }),
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            order_info_id: orderInfo.id,
            launched_p_id:
              launched_ps[Math.floor(Math.random() * launched_ps.length)].id,
            launched_p_qty: faker.number.int({ min: 1, max: 5 }),
            created_at: new Date(),
            updated_at: new Date()
          }
        )
      }
      await queryInterface.bulkInsert('Orders', orders, {})
    } catch (err) {
      console.log(err)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', {})
  }
}
