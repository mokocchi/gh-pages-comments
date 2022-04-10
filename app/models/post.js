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
      defaultValue: false
    },
    showComments: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Post'
  })
  Post.prototype.allowComments = () => {
    this.allowComments = true
  }
  Post.prototype.disallowComments = () => {
    this.allowComments = false
  }
  Post.prototype.showComments = () => {
    this.showComments = true
  }
  Post.prototype.hideComments = () => {
    this.showComments = false
  }
  return Post
}
