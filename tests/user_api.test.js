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

test('a specific user is within the returned usersß', async () => {
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

test('a user with a unique username can be added', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    firstname: 'Neljäs',
    lastname: 'Testaaja',
    username: 'Neljas',
    email: 'neljas@email.com',
    passwordHash: 'salasana',
    organization: 'NeljasTestiOrganisaatio',
    date: Date.now()
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()

  expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

  const usernames = usersAtEnd.map(user => user.username)
  expect(usernames).toContain(newUser.username)
})

test('user cannot be added if required fields are not included', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    passwordHash: 'salasana',
    organization: 'TestOrganization'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  expect(result.body.error).toContain('Path `firstname` is required')
  expect(result.body.error).toContain('Path `lastname` is required')
  expect(result.body.error).toContain('Path `username` is required')
  expect(result.body.error).toContain('Path `email` is required')

  const usersAtEnd = await helper.usersInDb()

  expect(usersAtEnd.length).toBe(usersAtStart.length)
})

test('only unique usernames and emails can be added to database', async () => {
  const usersAtStart = await helper.usersInDb()

  const firstNewUser = {
    firstname: 'Kolmas',
    lastname: 'Testaaja',
    username: 'Kolmas',
    email: 'kolmasTesti@email.com',
    passwordHash: 'salasana',
    organization: 'KolmasTestiYritys',
    date: new Date()
  }

  const firstResult = await api
    .post('/api/users')
    .send(firstNewUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(firstResult.body.error).toContain('`username` to be unique')

  const secondNewUser = {
    firstname: 'Kolmas',
    lastname: 'Testaaja',
    username: 'KolmasTesti',
    email: 'kolmas@email.com',
    passwordHash: 'salasana',
    organization: 'KolmasTestiYritys',
    date: new Date()
  }

  const secondResult = await api
    .post('/api/users')
    .send(secondNewUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(secondResult.body.error).toContain('`email` to be unique')

  const usersAtEnd = await helper.usersInDb()

  expect(usersAtEnd.length).toBe(usersAtStart.length)
})

afterAll(() => {
  mongoose.connection.close()
})
