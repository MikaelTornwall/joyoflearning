const mongoose =            require('mongoose')
const supertest =           require('supertest')
const app =                 require('../app')
const helper =              require('./test_helper')
const User =                require('../models/user')
const api =                 supertest(app)

beforeEach(async () => {
  await User.remove({})
  console.log('User database cleared')

  const userObjects = helper.initialUsers
    .map(user => new User(user))

  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
  console.log('User database initialized')
})

test('all users are returned', async () => {
  const res = await helper.usersInDb()

  expect(res.length).toBe(helper.initialUsers.length)
})

test('a specific note is within the returned notes', async () => {
  const res = await helper.usersInDb()

  const usernames = res.map(data => data.username)

  expect(usernames).toContain('Ensimmäinen')
})

test('users are returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a specific user can be returned', async () => {
  const res = await helper.usersInDb()

  const firstUser = res[0]

  const returnedUser = await User.findById(firstUser.id)

  expect(returnedUser.username).toBe(firstUser.username)
})

afterAll(() => {
  mongoose.connection.close()
})
