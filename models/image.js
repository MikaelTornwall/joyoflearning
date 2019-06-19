const mongoose =        require('mongoose')

const imageSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    path: String,
    size: Number,
    date: Date,
    contentType: String
  }
})

imageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image
