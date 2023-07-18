'use strict'
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const sellers = await queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE role = "seller" ',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )

      const shops = []
      for (let seller of sellers) {
        for (let i = 0; i < 2; i++) {
          shops.push({
            user_id: seller.id,
            name: faker.company.buzzNoun(),
            description: faker.lorem.words(10),
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }
      await queryInterface.bulkInsert('Shops', shops, {})
    } catch (err) {
      console.log(err)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shops', {})
  }
}
