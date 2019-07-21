const coursesRouter =   require('express').Router()
const Course =          require('../models/course')

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

coursesRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    console.log('Course body: ', body)

    const course = new Course({
      title: body.title,
      active: false,
      created: Date.now(),
      content: body.content
    })

    const savedCourse = await course.save()

    res.json(savedCourse)
  } catch(error) {
    next(error)
  }
})

module.exports = coursesRouter
