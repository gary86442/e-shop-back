'use strict'
const bcrypt = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */

//* 設定user 資料
const buyer = {
  account: 'buyer001',
  name: 'buyer001',
  email: 'buyer001@example.com',
  password: bcrypt.hashSync('titaner', 10),
  phone: '0912345678',
  address: '台灣桃園市XXX路XX號XX樓',
  role: 'buyer',
  created_at: new Date(),
  updated_at: new Date()
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert('Users', [buyer], {})
    } catch (err) {
      console.log(err)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
