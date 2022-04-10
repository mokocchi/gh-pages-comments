const express = require('express')
const { param, body } = require('express-validator')
const router = express.Router()
const { persist } = require('../sequelizeClient')
const { sequelize } = require('../models')
const verifyToken = require('./validateToken')
const Post = sequelize.models.Post

router.get('/get_posts',
  verifyToken,
  (req, res) => {
    let sent = false
    persist(async () => {
      await Post.findAll()
        .then(result => {
          if (result == null) {
            res.status(200).json({
              status: 'OK',
              data: []
            })
            sent = true
          } else {
            res.status(200).json({
              status: 'OK',
              data: result.map(post => post.permalink)
            })
            sent = true
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
        sent = true
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

router.post('/post_post',
  verifyToken,
  [
    body('post').whitelist(['abcdefghijklmnñopqrstuvwxyz', 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ', '0123456789', '-_']).default('').notEmpty()
  ]
  ,
  (req, res) => {
    let sent = false
    persist(async () => {
      await Post.findOne({ where: { permalink: req.body.permalink } })
        .then(async result => {
          if (result !== null) {
            res.status(400).json({
              status: 'error',
              code: 'post_already_exists'
            })
            sent = true
          } else {
            await Post.create({
              permalink: req.body.permalink
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
        sent = true
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

router.delete('/delete_post/:permalink',
  verifyToken,
  [
    param('post').whitelist(['abcdefghijklmnñopqrstuvwxyz', 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ', '0123456789', '-_']).default('').notEmpty()
  ]
  ,
  (req, res) => {
    let sent = false
    persist(async () => {
      await Post.findOne({ where: { permalink: req.params.permalink } })
        .then(async result => {
          if (result !== null) {
            await Post.destroy({
              where: {
                permalink: req.params.permalink
              }
            })
          }
          res.status(204).json()
          sent = true
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
        sent = true
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
