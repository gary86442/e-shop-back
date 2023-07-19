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
      const orderInfos = []
      for (let user of users) {
        const ships = await queryInterface.sequelize.query(
          `SELECT id FROM Ship_infos WHERE user_id = ${user.id} `,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT
          }
        )

        for (let i = 0; i < 3; i++) {
          let ship_info_id = ships[i].id
          orderInfos.push({
            user_id: user.id,
            ship_info_id: ship_info_id,
            pay_status: false,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }

      await queryInterface.bulkInsert('Order_infos', orderInfos, {})
    } catch (err) {
      console.log(err)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Order_infos', {})
  }
}
