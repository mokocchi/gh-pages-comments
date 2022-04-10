'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate (models) {

    }
  }
  Post.init({
    permalink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    allowComments: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      set (value) {
        this.setDataValue('allowComments', value)
      },
      get () {
        return this.getDataValue('allowComments')
      }
    },
    showComments: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      set (value) {
        this.setDataValue('showComments', value)
      },
      get () {
        return this.getDataValue('showComments')
      }
    }
  }, {
    sequelize,
    modelName: 'Post'
  })
  return Post
}
