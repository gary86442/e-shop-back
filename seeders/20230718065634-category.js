'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const categories = [
        {
          name: 'AAAAA',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'BBBBB',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'CCCCC',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'DDDDD',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'EEEEE',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]

      await queryInterface.bulkInsert('Categories', categories, {})
    } catch (err) {
      console.log(err)
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  }
}
