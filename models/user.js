const mongoose =    require('mongoose')

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  email: String,
  password: String
})

userSchema.statics.format = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    password: user.password
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
