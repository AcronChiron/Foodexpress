const request = require('supertest');
const app = require('../src/app');
const setup = require('./setup');
const User = require('../src/models/User');

let server;

beforeAll(async () => {
  await setup.start();
  server = app.listen(0);
});

afterAll(async () => {
  await server.close();
  await setup.stop();
});

test('creating duplicate user returns 409 via error handler', async () => {
  // create one user via model directly
  await User.create({ email: 'dup@example.com', username: 'dup', password: 'password' });
  // attempt to create same user via API
  const res = await request(server)
    .post('/users')
    .send({ email: 'dup@example.com', username: 'dup2', password: 'password' });
  expect(res.status).toBe(409);
  expect(res.body).toHaveProperty('error');
});
