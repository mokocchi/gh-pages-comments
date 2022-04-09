const express = require('express')
const router = express.Router()
const { client, persist } = require('../sequelizeClient')
const Comment = client.models.Comment

router.get('/get_comments/:post', (req, res) => {

})

router.post('/get_comments/:post', async (req, res) => {
  await persist(() => Comment.create({
    userHandle: 'mokocchi',
    message: 'hey there!',
    email: 'j@ou.com',
    date: new Date()
  })).then(result => {
    console.log(result)
    return res.status(200).json({
      status: 'OK'
    })
  }).catch(err =>
    console.log(err),
  res.json('error')
  )
})

module.exports = router
