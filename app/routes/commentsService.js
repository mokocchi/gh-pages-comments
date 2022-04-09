const express = require('express')
const router = express.Router()
const client = require('../pgClient')

router.get('/get_comments/:post', (req, res) => {
  client.connect()
  client.query('SELECT NOW()', (err, res) => {
    if (err == null) {
      console.log(res.rows[0])
    }
    console.log(err, res)
    client.end()
  })
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
