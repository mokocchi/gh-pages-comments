const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const app = express()
app.use(cors({
  origin: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Content-Length',
    'Content-MD5',
    'Content-Disposition',
    'Packaging',
    'In-Progress',
    'User-Agent'
  ]
}))
app.options('*')

const router = require('./routes/router')

app.get('/', (req, res) => {
  res.send(`Servidor de comenarios para ${process.env.PAGES_URL}`)
})

app.use(router)

app.use(function (req, res) {
  res.status(404).send({
    status: '404',
    developer_message: 'Recurso no encontrado',
    user_message: 'Recurso no encontrado',
    error_code: 1,
    more_info: ''
  })
})

console.log(`Escuchando en puerto ${process.env.PORT}`)

app.listen(process.env.PORT)
