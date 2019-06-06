const mongoose =        require('mongoose')

const studentSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  enrolled: Array,
  role: String
})

studentSchema.statics.format = (student) => {
  return {
    id: student._id,
    email: student.email,
    username: student.username,
    password: student.password,
    enrolled: [],
    role: student.role
  }
}

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
