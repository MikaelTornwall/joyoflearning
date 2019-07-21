const http =                require('http')
const express =             require('express')
const bodyParser =          require('body-parser')
const cors =                require('cors')
const mongoose =            require('mongoose')
const middleware =          require('./utils/middleware')
const usersRouter =         require('./controllers/users')
const userLoginRouter =     require('./controllers/userLogin')
const studentsRouter =      require('./controllers/students')
const studentLoginRouter =  require('./controllers/studentLogin')
const coursesRouter =       require('./controllers/courses')
const imagesRouter =        require('./controllers/images')
const config =              require('./utils/config')
const multer =              require('multer')
let GridFSStorage =         require('multer-gridfs-storage')
let Grid =                  require('gridfs-stream')
const morgan =              require('morgan')
const logger =              require('./utils/logger')
const app =                 express()

let storage = null

const connectToDatabase = async () => {
  try {
    const promise = await mongoose.connect(config.mongoUrl, { useNewUrlParser: true })

    storage = new GridFSStorage({
      db: promise
    })

    logger.info('Connected to database')
  } catch (error) {
    logger.error('error connecting to database: ', error.message)
  }
}

connectToDatabase()

/*const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (fieldname, filename) {
    return filename
  }
})*/

/*const storage = require('multer-gridfs-storage')({
  url: config.mongoUrl
})*/

//const upload = multer({ storage: storage })

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(middleware.requestLogger)
app.use('/uploads', express.static('uploads'))
app.use('/api/users', usersRouter)
app.use('/api/students', studentsRouter)
app.use('/api/users/login', userLoginRouter)
app.use('/api/students/login', studentLoginRouter)
app.use('/api/images', imagesRouter)
app.use('/api/courses', coursesRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
