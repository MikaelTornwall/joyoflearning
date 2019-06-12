const http =                require('http')
const express =             require('express')
const bodyParser =          require('body-parser')
const cors =                require('cors')
const mongoose =            require('mongoose')
const { logger, error } =   require('./utils/middleware')
const User =                require('./models/user')
const usersRouter =         require('./controllers/users')
const studentsRouter =      require('./controllers/students')
const imagesRouter =        require('./controllers/images')
const config =              require('./utils/config')
const multer =              require('multer')
const morgan =              require('morgan')
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

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (fieldname, filename) {
    return filename
  }
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(logger)
app.use('/uploads', express.static('uploads'))
app.use('/api/users', usersRouter)
app.use('/api/students', studentsRouter)
app.use('/api/images', imagesRouter)

const server = http.createServer(app)

const PORT = config.port || 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

app.use(error)
