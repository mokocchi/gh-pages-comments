const express = require('express')
const { param, body, validationResult } = require('express-validator')
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
    const { errors } = validationResult(req)
    if (errors.length > 0) {
      console.log(errors)
      res.status(400).json({
        status: 'error',
        code: 'parameter_error'
      })
      return
    }
    let sent = false
    persist(async () => {
      await Post.findOne({ where: { permalink: req.params.post } })
        .then(result => {
          const count = (req.query.count !== undefined)
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
  body('userHandle').isLength({ max: 25 }).notEmpty(),
  body('message').isLength({ max: 250 }).notEmpty(),
  body('email').if(body('email').notEmpty()).isEmail()
],
async (req, res) => {
  const { errors } = validationResult(req)
  if (errors.length > 0) {
    console.log(errors)
    res.status(400).json({
      status: 'error',
      code: 'parameter_error'
    })
    return
  }
  let sent = false
  persist(async () => {
    await Post.findOne({ where: { permalink: req.params.post } })
      .then(async result => {
        if (result == null) {
          res.status(400).json({
            status: 'error',
            code: 'post_not_exists'
          })
        } else {
          await Comment.count().then(count => {
            if (count > 2) {
              console.log('Max comments for the post reached')
              res.status(400).json({
                status: 'error',
                code: 'max_comments'
              })
              sent = true
            } else {
              console.log(result.id)
              Comment.create({
                userHandle: req.body.userHandle,
                message: req.body.message,
                email: req.body.email,
                date: new Date(),
                postId: result.id
              })
            }
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
    if (
      !sent) {
      res.status(500).json({
        status: 'error'
      })
    }
  })
})

module.exports = router
