const mongoose = require('mongoose')

require('dotenv').config()

const mongoUrl = process.env.MONGODB_URI
const port = process.env.PORT

if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = process.env.PRODUCTION_MONGODB_URI
}

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = { mongoUrl, port }
