'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate (models) {
      Comment.belongsTo(models.Post,
        {
          foreignKey: {
            name: 'postId',
            field: 'postId'
          },
          as: 'Post'
        })
    }
  }
  Comment.init({
    uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    userHandle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: DataTypes.STRING,
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Comment'
  })

  Comment.removeAttribute('PostId')
  return Comment
}
