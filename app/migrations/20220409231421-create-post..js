'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Post', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      permalink: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    await queryInterface.createTable('Comment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      userHandle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: Sequelize.STRING,
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      postId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Post',
            schema: 'public'
          },
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    await queryInterface.createTable('Reply', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      userHandle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: Sequelize.STRING,
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      commentId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Comment',
            schema: 'public'
          },
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Reply')
    await queryInterface.dropTable('Comment')
    await queryInterface.dropTable('Post')
  }
}
