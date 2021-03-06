const app =         require('./app')
const http =        require('http')
const config =      require('./utils/config')
const logger =      require('./utils/logger')
const mongoose =    require('mongoose')

const server = http.createServer(app)

const PORT = config.port || 3001

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

server.on('close', () => {
  mongoose.connection.close()
})
