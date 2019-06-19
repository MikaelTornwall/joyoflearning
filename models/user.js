const mongoose =    require('mongoose')

const userSchema = new mongoose.Schema({
  id: String,
  firstname: {
    type: String,
    minlength: 2,
    required: true
  },
  lastname: {
    type: String,
    minlength: 2,
    required: true
  },
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
  organization: {
    type: String,
    minlength: 2,
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  logo: Buffer,
  courses: Array,
  role: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
