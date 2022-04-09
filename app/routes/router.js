const express = require('express')
const router = express.Router()
const commentsService = require('./commentsService')

router.use((req, res, next) => {
  console.log(`Called: ${req.method} ${req.path}`)
  next()
})

router.use(function (req, res, next) {
  res.on('finish', function () {
    console.log('Status: ' + res.statusCode)
  })
  next()
})

router.use(commentsService)

module.exports = router
