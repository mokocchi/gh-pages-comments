const { Sequelize } = require('sequelize')
console.log(process.env.DATABASE_URL)
const connectionString = `${process.env.DATABASE_URL}`
const client = new Sequelize(connectionString, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const persist = async (callback = () => {}) => {
  await client.sync({ force: false })
  return callback()
}

module.exports = {
  client,
  persist
}
