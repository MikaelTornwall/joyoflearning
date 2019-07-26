const mongoose =        require('mongoose')

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  active: Boolean,
  created: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: Map
})

courseSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Course = mongoose.model('Course', courseSchema)

module.exports = Course
