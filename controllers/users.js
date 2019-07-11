const usersRouter =   require('express').Router()
const bcrypt = require('bcrypt')
const User =          require('../models/user')
const Role =          require('../utils/role')

usersRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({})

    res.json(users)
  } catch (exception) {
    console.log(exception)
  }
})

usersRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id

    const user = await User.findById({ _id: id })

    if (user) {
      res.json(user.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body

    const saltrounds = 10
    const passwordHash = await bcrypt.hash(body.passwordHash, saltrounds)

    const user = new User({
      firstname: body.firstname,
      lastname: body.lastname,
      username: body.username,
      email: body.email,
      passwordHash: passwordHash || '',
      organization: body.organization,
      date: new Date(),
      role: Role.Admin
    })

    const savedUser = await user.save()

    res.json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    await User.findByIdAndRemove(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
