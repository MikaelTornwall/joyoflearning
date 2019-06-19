const mongoose =        require('mongoose')

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    required: true
  },
  username: {
    type: String,
    minlength: 5,
    required: true
  },
  password: {
    type: String,
    minlength: 5,
    required: true
  },
  enrolled: Array,
  role: String
})

studentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
