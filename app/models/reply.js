'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate (models) {
      Reply.belongsTo(models.Comment)
    }
  }
  Reply.init({
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
    modelName: 'Reply'
  })
  return Reply
}
