const coursesRouter =   require('express').Router()
const jwt =             require('jsonwebtoken')
const Course =          require('../models/course')
const User =            require('../models/user')

coursesRouter.get('/', async (req, res, next) => {
  try {
    const courses = await Course.find({})
    res.json(courses)
  } catch(error) {
    next(error)
  }
})

coursesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id

    const course = await Course.findById(id)

    if (course) {
      res.json(course.toJSON())
    } else {
      res.status(404).end()
    }
  } catch(error) {
    next(error)
  }
})

const getToken = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

// Create
coursesRouter.post('/', async (req, res, next) => {
  const body = req.body

  const token = getToken(req)
  console.log('token: ', token)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRETUSER)

    console.log('decodedToken: ', decodedToken)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const course = new Course({
      title: body.title,
      user: user._id,
      active: false,
      created: Date.now(),
      content: body.content
    })

    const savedCourse = await course.save()

    user.courses = user.courses.concat(savedCourse._id)
    await user.save()
    res.json(savedCourse.toJSON())
  } catch(error) {
    next(error)
  }
})

coursesRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  const token = getToken(req)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRETUSER)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const course = await Course.findById(id)
    const user = await User.findById(course.user)
    const courses = Array.from(user.courses)

    if (course.user == decodedToken.id) {
      let courseIds = courses.filter(courseId => courseId != id)

      user.courses = courseIds

      await user.save()
      await Course.findByIdAndRemove(id)
      res.status(204).end()
    } else {
      return res.status(401).json({ error: 'Wrong user id' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = coursesRouter
