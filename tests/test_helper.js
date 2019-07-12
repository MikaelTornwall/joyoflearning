const User =                require('../models/user')
const Student =             require('../models/student')

const initialUsers = [
  {
    firstname: 'Ensimmäinen',
    lastname: 'Testikäyttäjä',
    username: 'Ensimmäinen',
    email: 'ensimmäinen@email.com',
    passwordHash: 'salasana',
    organization: 'TestiFirma',
    date: Date.now()
  },
  {
    firstname: 'Toinen',
    lastname: 'Testikäyttäjä',
    username: 'Toinen',
    email: 'toinen@email.com',
    passwordHash: 'salasana',
    organization: 'ToinenTestiFirma',
    date: Date.now()
  },
  {
    firstname: 'Kolmas',
    lastname: 'Testaaja',
    username: 'Kolmas',
    email: 'kolmas@email.com',
    passwordHash: 'salasana',
    organization: 'KolmasTestiYritys',
    date: Date.now()
  }
]

const initialStudents = [
  {
    username: 'FirstStudent',
    email: 'firststudent@email.com',
    passwordHash: 'salasana'
  },
  {
    username: 'SecondStudent',
    email: 'secondstudent@email.com',
    passwordHash: 'salasana'
  },
  {
    username: 'ThirdStudent',
    email: 'thirdstudent@email.com',
    passwordHash: 'salasana'
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const studentsInDb = async () => {
  const students = await Student.find({})
  return students.map(student => student.toJSON())
}

module.exports = { initialUsers, usersInDb, initialStudents, studentsInDb }
