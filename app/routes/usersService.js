const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { persist } = require('../sequelizeClient')
const { sequelize } = require('../models')
const User = sequelize.models.User

router.post('/token',
  [
    body('username').isAlphanumeric().default('').notEmpty(),
    body('password').default('').notEmpty()
  ],
  (req, res) => {
    persist(() => {
      User.findOne({ where: { username: req.params.username } })
        .then(async result => {
          if (result == null) {
            res.status(400).json({
              status: 'error',
              code: 'auth_error'
            })
          } else {
            if (!await result.validPassword(req.body.username, result.password)) {
              res.status(200).json({
                status: 'authenticated',
                token: 'JWT'
              })
            }
          }
        })
    }).catch(err => {
      console.log(err)
    })
  })
