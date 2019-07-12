const mongoose =            require('mongoose')
const supertest =           require('supertest')
const app =                 require('../app')
const helper =              require('./test_helper')
const Student =             require('../models/student')
const api =                 supertest(app)

beforeEach(async () => {
  await Student.remove({})
  console.log('Student database cleared')

  const studentObjects = helper.initialStudents
    .map(student => new Student(student))

  const promiseArray = studentObjects.map(student => student.save())
  await Promise.all(promiseArray)
  console.log('Student database initialized')
})

test('students are returned as json', async () => {
  await api
    .get('/api/students')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all users are returned', async () => {
  const students = await helper.studentsInDb()
  expect(students.length).toBe(helper.initialStudents.length)
})

test('a specific student is within the returned users', async () => {
  const students = await helper.studentsInDb()
  const usernames = students.map(student => student.username)
  expect(usernames).toContain('FirstStudent')
})

test('a specific user can be returned', async () => {
  const res = await helper.studentsInDb()
  const student = res[0]
  const returnedStudent = await Student.findById(student.id)
  expect(returnedStudent.username).toBe(student.username)
})

test('a user with a unique username can be added', async () => {
  const studentsAtStart = await helper.studentsInDb()

  const newStudent = {
    username: 'FourthStudent',
    email: 'fourthStudent@email.com',
    password: 'salasana'
  }

  await api
    .post('/api/students')
    .send(newStudent)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const studentsAtEnd = await helper.studentsInDb()
  expect(studentsAtEnd.length).toBe(studentsAtStart.length + 1)
})

test('student cannot be added if required fields are not included', async () => {
  const studentsAtStart = await helper.studentsInDb()

  const newStudent = {
    password: 'salasana'
  }

  const res = await api
    .post('/api/students')
    .send(newStudent)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(res.body.error).toContain('Path `username` is required')
  expect(res.body.error).toContain('Path `email` is required')

  const studentsAtEnd = await helper.studentsInDb()
  expect(studentsAtEnd.length).toBe(studentsAtStart.length)
})

test('only unique student usernames and emails can be added to the database', async () => {
  const studentsAtStart = await helper.studentsInDb()

  const newStudent = {
    username: 'FirstStudent',
    email: 'firststudent@email.com',
    password: 'salasana'
  }

  const res = await api
    .post('/api/students')
    .send(newStudent)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(res.body.error).toContain('`username` to be unique')
  expect(res.body.error).toContain('`email` to be unique')

  const studentsAtEnd = await helper.studentsInDb()
  expect(studentsAtEnd.length).toBe(studentsAtStart.length)
})

test('student can be deleted', async () => {
  const studentsAtStart = await helper.studentsInDb()

  const newStudent = {
    username: 'FifthStudent',
    email: 'fifthstudent@email.com',
    password: 'password'
  }

  const res = await api
    .post('/api/students')
    .send(newStudent)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const studentsAfterPost = await helper.studentsInDb()
  expect(studentsAfterPost.length).toBe(studentsAtStart.length + 1)

  await api
    .delete(`/api/students/${res.body.id}`)
    .expect(204)

  const studentsAtEnd = await helper.studentsInDb()
  expect(studentsAtEnd.length).toBe(studentsAtStart.length)
})

afterAll(() => {
  mongoose.connection.close()
})
