const mongoose =    require('mongoose')

const userSchema = new mongoose.Schema({
  id: String,
  firstname: String,
  lastname: String,
  email: String,
  username: String,
  password: String,
  organization: String,
  courses: Array,
  role: String
})

userSchema.statics.format = (user) => {
  console.log("Role: ", Role.Admin)
  return {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    username: user.username,
    password: user.password,
    organization: user.organization,
    courses: [],
    role: user.role
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
