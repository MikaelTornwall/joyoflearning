const imagesRouter =   require('express').Router()
const fs =             require('fs')
const Image =          require('../models/image')
const multer =         require('multer')
const upload =         multer({ dest: 'uploads/' })

imagesRouter.get('/', async (req, res) => {
  try {
    const images = await Image.find({})
    console.log(images)
    res.json(images)
  } catch (exception) {
    console.log(exception)
  }
})

// Muista enctype="multipart/form-data" tai muu datan muuntaminen front-endissa
// upload.single('image'), image:lla on vastaava <input type="file" name="image" />
imagesRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log("FILE: " + req.file)
    if (!req.file) {
      console.log('No file')
      res.send({
        success: false
      })
    } else {
      console.log('file received')
      res.send({
        success: true
      })
    }

    console.log("Request ---", req.body);
    console.log("Request file ---", req.file)

    const host = req.host
    // file or files object
    const filePath = req.protocol + '://' + host + ':3001/' + req.file.path

    const newImage = new Image({
      image: {
        data: req.file.buffer,
        path: filePath,
        size: req.file.size,
        date: Date.now(),
        contentType: req.file.mimetype
      }
    })

    newImage.save()
  } catch (exception) {
    res.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = imagesRouter
