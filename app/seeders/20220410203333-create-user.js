'use strict'
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = {
      username: `${process.env.USER}`,
      password: `${process.env.PASSWORD}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const salt = await bcrypt.genSaltSync(10, 'a')
    user.password = bcrypt.hashSync(user.password, salt)
    return queryInterface.bulkInsert('Users', [user], { ignoreDuplicates: true })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
