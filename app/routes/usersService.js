const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const { persist } = require('../sequelizeClient')
const { sequelize } = require('../models')
const jwt = require('jsonwebtoken')
const User = sequelize.models.User

router.post('/token',
  [
    body('username').isAlphanumeric().default('').notEmpty(),
    body('password').default('').notEmpty()
  ],
  (req, res) => {
    const { errors } = validationResult(req)
    if (errors.length > 0) {
      console.log(errors)
      res.status(400).json({
        status: 'error',
        code: 'parameter_error'
      })
      return
    }
    persist(() => {
      User.findOne({ where: { username: req.body.username } })
        .then(async result => {
          if (result == null) {
            res.status(400).json({
              status: 'error',
              code: 'auth_error'
            })
          } else {
            if (!await result.validPassword(req.body.password, result.password)) {
              res.status(400).json({
                status: 'error',
                code: 'auth_error'
              })
            } else {
              res.status(200).json({
                status: 'authenticated',
                token: jwt.sign({
                  name: result.username,
                  id: result.id
                }, process.env.TOKEN_SECRET)
              })
            }
          }
        })
    }).catch(err => {
      console.log(err)
    })
  })

module.exports = router
