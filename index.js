const express =     require('express')
const bodyParser =  require('body-parser')
const cors =        require('cors')
const mongoose =    require('mongoose')
const app =         express()

const logger = (request, response, next) => {
  console.log('Method:',request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(bodyParser.json())
app.use(logger)

app.get('/', (req, res) => {
  res.send('<h1>Hello, world!</h1>')
})

app.get('/api/users', (req, res) => {
  res.send('<h1>Hello, world!</h1>')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)
