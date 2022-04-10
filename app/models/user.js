'use strict'
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {

    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    instanceMethods: {
      validPassword: (password) => {
        return bcrypt.compareSync(password, this.password)
      }
    },
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10, 'a')
          user.password = bcrypt.hashSync(user.password, salt)
        }
      },
      beforeUpdate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10, 'a')
          user.password = bcrypt.hashSync(user.password, salt)
        }
      }
    },
    sequelize,
    modelName: 'User'
  })
  User.prototype.validPassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash)
  }
  return User
}
