const express = require('express')
const router = express.Router()

router.get('/get_comments/:post', (req, res) => {
  return res.status(200).json({
    status: 'OK'
  })
})

router.post('/get_comments/:post', (req, res) => {
  return res.status(200).json({
    status: 'OK'
  })
})

module.exports = router
