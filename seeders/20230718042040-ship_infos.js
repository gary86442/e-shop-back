'use strict'
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const users = await queryInterface.sequelize.query(
        'SELECT id FROM Users WHERE role = "buyer" ',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      )
      const shipInfos = []
      for (let user of users) {
        for (let i = 0; i < 3; i++) {
          shipInfos.push({
            phone: faker.phone.number('09##-###-###'),
            name: faker.person.lastName(),
            address: faker.location.streetAddress(),
            user_id: user.id,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }
      await queryInterface.bulkInsert('Ship_infos', shipInfos, {})
    } catch (err) {
      console.log(err)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ship_infos', {})
  }
}
