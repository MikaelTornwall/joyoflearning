const http =                require('http')
const express =             require('express')
const bodyParser =          require('body-parser')
const cors =                require('cors')
const mongoose =            require('mongoose')
const { logger, error } =   require('./utils/middleware')
const User =                require('./models/user')
const usersRouter =         require('./controllers/users')
const config =              require('./utils/config')
const app =                 express()

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUrl)
    console.log(`Connected to database`)
  } catch (error) {
    console.log(error)
  }
}

connectToDatabase()

app.use(cors())
app.use(bodyParser.json())
app.use(logger)
app.use('/api/users', usersRouter)

const server = http.createServer(app)

const PORT = config.port || 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

app.use(error)
