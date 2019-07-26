const jwt =           require('jsonwebtoken')
const bcrypt =        require('bcrypt')
const studentLoginRouter =   require('express').Router()
const Student =          require('../models/student')

studentLoginRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body

    const student = await Student.findOne({ username: body.username })
    const passwordCorrect = student === null
      ? false
      : await bcrypt.compare(body.password, student.passwordHash)

    if (!(student && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }

    const studentForToken = {
      username: student.username,
      id: student.id
    }

    const token = jwt.sign(studentForToken, process.env.SECRETSTUDENT)

    res
      .status(200)
      .send({ token, id: student._id, username: student.username, role: student.role })
  } catch(error) {
    next(error)
  }
})

module.exports = studentLoginRouter
