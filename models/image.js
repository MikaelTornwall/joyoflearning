const mongoose =        require('mongoose')

const imageSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    path: String,
    size: Number,
    contentType: String
  }
})

imageSchema.statics.format = (image) => {
  return {
    image: {
      data: image.data,
      path: image.path,
      size: image.size,
      contentType: image.contentType
    }
  }
}

const Image = mongoose.model('Image', imageSchema)

module.exports = Image
