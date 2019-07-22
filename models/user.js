const mongoose =        require('mongoose')
var uniqueValidator =   require('mongoose-unique-validator')

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
  organization: {
    type: String,
    minlength: 2,
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  logo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],
  role: String
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject.passwordHash
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
