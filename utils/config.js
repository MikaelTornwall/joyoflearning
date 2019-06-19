const mongoose = require('mongoose')

require('dotenv').config()

let mongoUrl = process.env.MONGODB_URI
let port = process.env.PORT

if (process.env.NODE_ENV === 'production') {
  mongoUrl = process.env.PRODUCTION_MONGODB_URI
}

if (process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.TEST_MONGODB_URI  
}

module.exports = { mongoUrl, port }
