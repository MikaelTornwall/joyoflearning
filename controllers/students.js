const studentsRouter =   require('express').Router()
const Student =          require('../models/student')
const Role =          require('../utils/role')

studentsRouter.get('/', async (req, res) => {
  try {
    const students = await Student.find({})

    res.json(students)
  } catch (exception) {
    console.log(exception)
  }

})

studentsRouter.post('/', async (req, res) => {
  try {
    const body = req.body

    const student = new Student({
      email: body.email,
      username: body.username,
      password: body.password,
      role: Role.Student
    })

    const savedStudent = await student.save()

    res.json(savedStudent)
  } catch (exception) {
    res.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = studentsRouter
