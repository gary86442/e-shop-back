'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */

//* 設定user 資料
const users = []
for (let i = 1; i < 10; i++) {
  users.push({
    account: `buyer00${i}`,
    email: `buyer00${i}@example.com`,
    password: bcrypt.hashSync('titaner', 10),
    //? 可能把這個地址資訊給統一到SHIP_INFO?
    phone: faker.phone.number('09##-###-###'),
    name: faker.person.lastName(),
    address: faker.location.streetAddress(),
    role: 'buyer',
    created_at: new Date(),
    updated_at: new Date()
  })
  users.push({
    account: `seller00${i}`,
    email: `seller00${i}@example.com`,
    password: bcrypt.hashSync('titaner', 10),
    //? 可能把這個地址資訊給統一到SHIP_INFO?
    phone: faker.phone.number('09##-###-###'),
    name: faker.person.lastName(),
    address: faker.location.streetAddress(),
    role: 'seller',
    created_at: new Date(),
    updated_at: new Date()
  })
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert('Users', users, {})
    } catch (err) {
      console.log(err)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
