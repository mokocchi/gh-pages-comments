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
    }
  }, {
    sequelize,
    modelName: 'Post'
  })
  return Post
}
