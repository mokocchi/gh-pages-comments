const express = require('express')
const { param, body } = require('express-validator')
const router = express.Router()
const { persist } = require('../sequelizeClient')
const { sequelize } = require('../models')
const Comment = sequelize.models.Comment
const Post = sequelize.models.Post

router.get('/comments/:post',
  [
    param('post').whitelist(['abcdefghijklmnñopqrstuvwxyz', 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ', '0123456789', '-_']).default('').notEmpty()
  ],
  (req, res) => {
    let sent = false
    persist(async () => {
      await Post.findOne({ where: { permalink: req.params.post } })
        .then(result => {
          const count = (req.body.count !== undefined)
          if (result == null) {
            res.status(200).json({
              status: 'OK',
              data: count ? 0 : []
            })
          } else {
            Comment.findAll({ where: { postId: result.id } })
              .then(it => {
                res.status(200).json({
                  status: 'OK',
                  data: count
                    ? it.length
                    : it.map(item => {
                      return {
                        userHandle: item.userHandle,
                        message: item.message,
                        email: item.email
                      }
                    })
                })
              }).catch(err => {
                console.log(err)
                res.status(500).json({
                  status: 'error'
                })
              })
          }
          sent = true
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({
            status: 'error'
          })
          sent = true
        })
    }).catch(err => {
      console.log(err)
      if (!sent) {
        res.status(500).json({
          status: 'error'
        })
      }
    })
  })

router.post('/comments/:post', [
  body('userHandle').isLength({ max: 25 }),
  body('message').isLength({ max: 250 }),
  body('email').isEmail()
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
      res.status(500).json({
        status: 'error'
      })
      sent = true
    })
  }).then(result => {
    if (!sent) {
      res.status(200).json({
        status: 'OK'
      })
    }
  }).catch(err => {
    console.log(err)
    if (!sent) {
      res.status(500).json({
        status: 'error'
      })
    }
  })
})

module.exports = router
