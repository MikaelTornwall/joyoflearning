const usersRouter =   require('express').Router()
const bcrypt =        require('bcrypt')
const multer =        require('multer')
const upload =        multer({ dest: 'uploads/' })
const User =          require('../models/user')
const Role =          require('../utils/role')
const Image =         require('../models/image')
const Course =        require('../models/course')

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id

    const user = await User.findById({ _id: id })

    if (user) {
      res.json(user.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id/courses', async (req, res, next) => {
  try {
    const id = req.params.id

    const user = await User.findById(id)

    const userCourses = user.courses

    const getCourses = async () => {
      return await Promise.all(userCourses.map(id => Course.findById(id)))
    }

    const courseObjects = await getCourses()

    console.log(courseObjects)
    res.json(courseObjects)
  } catch(error) {
    next(error)
  }
})

usersRouter.post('/', upload.single('logo'), async (req, res, next) => {
  try {

    const body = req.body
    console.log(body)
    let logoId = null
    console.log('FILE: ' + req.file)

    if (req.file) {
      console.log('Request ---', body)
      console.log('Request file ---', req.file)

      const host = req.host
      const filePath = req.protocol + '://' + host + ':3001/' + req.file.path

      const newImage = new Image({
        image: {
          data: req.file.buffer,
          path: filePath,
          size: req.file.size,
          date: new Date(),
          contentType: req.file.mimetype
        }
      })

      const savedImage = await newImage.save()
      logoId = savedImage.id
    }

    const saltrounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltrounds)

    const user = new User({
      firstname: body.firstname,
      lastname: body.lastname,
      username: body.username,
      email: body.email,
      passwordHash,
      organization: body.organization,
      logo: logoId,
      date: new Date(),
      role: Role.Admin
    })

    const savedUser = await user.save()

    if (logoId) {
      await Image.findByIdAndUpdate(logoId, { user: savedUser.id }, { new: true })
    }

    res.json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    await User.findByIdAndRemove(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
