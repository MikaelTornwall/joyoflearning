const usersRouter =   require('express').Router()
const User =          require('../models/user')

usersRouter.get('/', async (req, res) => {
  try {
    const users = await User
      .find({})

    res.json(users)
  } catch (exception) {
    console.log(exception)
  }
})

usersRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id

    const user = await User.findOne({ _id: id })

    if (user) {
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (exception) {
    ress.status(404).send({ error: 'malformatted id' })
  }
})

usersRouter.post('/', async (req, res) => {
  try {
    const body = req.body

    const user = new User({
      username: body.username,
      email: body.email,
      password: body.password
    })

    const savedUser = await user.save()

    res.json(savedUser)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'something went wrong' })
  }

})

module.exports = usersRouter
