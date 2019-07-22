const jwt =                 require('jsonwebtoken')
const bcrypt =              require('bcrypt')
const userLoginRouter =     require('express').Router()
const User =                require('../models/user')

userLoginRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body

    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }
    
    const userForToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRETUSER)

    res
      .status(200)
      .send({ token, username: user.username, id: user._id })
  } catch(error) {
    next(error)
  }
})

module.exports = userLoginRouter
