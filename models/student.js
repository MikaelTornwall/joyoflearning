const mongoose =        require('mongoose')
var uniqueValidator =   require('mongoose-unique-validator')

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    required: true,
    unique: true
  },
  username: {
    type: String,
    minlength: 5,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    minlength: 5,
    required: true
  },
  enrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],
  role: String
})

studentSchema.plugin(uniqueValidator)

studentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject.passwordHash
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
