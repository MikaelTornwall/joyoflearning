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

imageSchema.statics.format = (image) => {
  return {
    image: {
      data: image.data,
      path: image.path,
      size: image.size,
      date: image.date,
      contentType: image.contentType
    }
  }
}

const Image = mongoose.model('Image', imageSchema)

module.exports = Image
