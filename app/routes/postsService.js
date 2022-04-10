const express = require('express')
const { param, body } = require('express-validator')
const router = express.Router()
const { persist } = require('../sequelizeClient')
const { sequelize } = require('../models')
const verifyToken = require('./validateToken')
const Post = sequelize.models.Post

router.get('/posts',
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
              data: result.map(post => {
                return {
                  permalink: post.permalink,
                  allowComments: post.allowComments,
                  showComments: post.showComments
                }
              })
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

router.post('/posts',
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
            Post.create({
              permalink: req.body.permalink
            }).then(result => {
              res.status(201).json({
                status: 'OK',
                data: {
                  permalink: result.permalink
                }
              })
              sent = true
            }).catch(err => {
              console.log(err)
              res.status(500).json({
                status: 'error'
              })
              sent = true
            })
          }
        }).catch(err => {
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

router.get('/posts/:permalink',
  verifyToken,
  [
    param('permalink').whitelist(['abcdefghijklmnñopqrstuvwxyz', 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ', '0123456789', '-_']).default('').notEmpty()
  ]
  ,
  (req, res) => {
    persist(async () => {
      Post.findOne({ where: { permalink: req.params.permalink } })
        .then(async result => {
          if (result === null) {
            res.status(404).json({
              status: 'error',
              code: 'post_not_exists'
            })
          } else {
            res.status(200).json({
              status: 'OK',
              data: {
                permalink: result.permalink,
                showComments: result.showComments,
                allowComments: result.allowComments
              }
            })
          }
        }).catch(err => {
          console.log(err)
          res.status(500).json({
            status: 'error'
          })
        })
    }).catch(err => {
      console.log(err)
      res.status(500).json({
        status: 'error'
      })
    })
  })

router.delete('/posts/:permalink',
  verifyToken,
  [
    param('permalink').whitelist(['abcdefghijklmnñopqrstuvwxyz', 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ', '0123456789', '-_']).default('').notEmpty()
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

router.put('/posts/:permalink',
  verifyToken,
  [
    param('permalink').whitelist(['abcdefghijklmnñopqrstuvwxyz', 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ', '0123456789', '-_']).default('').notEmpty(),
    body('allowComments').isBoolean(),
    body('showComments').isBoolean()
  ]
  ,
  (req, res) => {
    let sent = false
    persist(async () => {
      await Post.findOne({ where: { permalink: req.params.permalink } })
        .then(async result => {
          if (result !== null) {
            const allowComments = (req.body.allowComments !== undefined) ? req.body.allowComments : result.allowComments
            const showComments = (req.body.showComments !== undefined) ? req.body.showComments : result.showComments
            Post.update({ allowComments, showComments }, {
              where: {
                permalink: req.params.permalink
              }
            }).then(resul => {
              res.status(200).json({
                status: 'OK',
                data: {
                  permalink: req.params.permalink,
                  allowComments: allowComments,
                  showComments: showComments
                }
              })
            })
          } else {
            res.status(404).json({
              status: 'error',
              code: 'post_not_exists'
            })
          }
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
