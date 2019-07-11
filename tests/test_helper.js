const User =                require('../models/user')

const initialUsers = [
  {
    firstname: 'Ensimmäinen',
    lastname: 'Testikäyttäjä',
    username: 'Ensimmäinen',
    email: 'ensimmäinen@email.com',
    passwordHash: 'salasana',
    organization: 'TestiFirma',
    date: new Date()
  },
  {
    firstname: 'Toinen',
    lastname: 'Testikäyttäjä',
    username: 'Toinen',
    email: 'toinen@email.com',
    passwordHash: 'salasana',
    organization: 'ToinenTestiFirma',
    date: new Date()
  },
  {
    firstname: 'Kolmas',
    lastname: 'Testaaja',
    username: 'Kolmas',
    email: 'kolmas@email.com',
    passwordHash: 'salasana',
    organization: 'KolmasTestiYritys',
    date: new Date()
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { initialUsers, usersInDb }
