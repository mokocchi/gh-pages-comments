const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const { persist } = require('../sequelizeClient')
const { sequelize } = require('../models')
const Comment = sequelize.models.Comment

router.get('/get_comments/:post', (req, res) => {
  return res.status(200).json({
    status: 'OK'
  })
})

router.post('/get_comments/:post', [
  check('userHandle').isLength({ max: 25 }),
  check('message').isLength({ max: 250 }),
  check('email').isEmail()
],
async (req, res) => {
  let sent = false
  persist(async () => {
    await Comment.count().then(result => {
      if (result > 2) {
        console.log('Max comments for the post reached')
        res.status(400).json({
          status: 'error',
          code: 'max_comments'
        })
        sent = true
      } else {
        Comment.create({
          userHandle: req.body.userHandle,
          message: req.body.message,
          email: req.body.email,
          date: new Date()
        })
      }
    }).catch(err => {
      console.log(err)
      res.status(500).json('error')
      sent = true
    })
  }).then(result => {
    if (!sent) {
      return res.status(200).json({
        status: 'OK'
      })
    }
  }).catch(err => {
    console.log(err)
    if (!sent) {
      res.status(500).json('error')
    }
  })
})

module.exports = router
