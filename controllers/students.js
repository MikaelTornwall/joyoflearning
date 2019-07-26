const studentsRouter =   require('express').Router()
const bcrypt =           require('bcrypt')
const Student =          require('../models/student')
const Role =             require('../utils/role')

studentsRouter.get('/', async (req, res, next) => {
  try {
    const students = await Student.find({})
    res.json(students)
  } catch (error) {
    next(error)
  }
})

studentsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id

    const student = await Student.findById({ _id: id })

    if (student) {
      res.json(student.toJSON())
    } else {
      res.status(404).end
    }
  } catch(error) {
    next(error)
  }
})

studentsRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body

    const saltrounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltrounds)

    const student = new Student({
      email: body.email,
      username: body.username,
      passwordHash,
      role: Role.Student
    })

    const savedStudent = await student.save()

    res.json(savedStudent)
  } catch (error) {
    next(error)
  }
})

// Enroll
studentsRouter.post('/enroll/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const courseId = req.body.courseId

    const student = await Student.findById(id)

    const before = Array.from(student.enrolled)
    const after = Array.from(student.enrolled.filter(course => course != courseId))

    before.length != after.length ? student.enrolled = after : student.enrolled = student.enrolled.concat(courseId)

    const savedStudent = await student.save()
    res.json(savedStudent.toJSON())
  } catch(error) {
    next(error)
  }
})


studentsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    await Student.findByIdAndRemove(id)
    res.status(204).end()
  } catch(error) {
    next(error)
  }
})

module.exports = studentsRouter
