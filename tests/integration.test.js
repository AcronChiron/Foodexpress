const request = require('supertest');
const app = require('../src/app');
const setup = require('./setup');
const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');
const Menu = require('../src/models/Menu');

let server;

beforeAll(async () => {
  await setup.start();
  server = app.listen(0); // random port

  // seed an admin user and a regular user
  await User.create([
    { email: 'admin@example.com', username: 'admin', password: 'password', role: 'admin' },
    { email: 'user@example.com', username: 'user', password: 'password', role: 'user' },
  ]);

  // seed restaurants and menus
  const restaurants = await Restaurant.create([
    { name: 'Resto A', address: 'Addr A' },
    { name: 'Resto B', address: 'Addr B' },
  ]);

  await Menu.create([
    { restaurant_id: restaurants[0]._id, name: 'Dish 1', price: 5 },
    { restaurant_id: restaurants[0]._id, name: 'Dish 2', price: 10 },
    { restaurant_id: restaurants[1]._id, name: 'Dish 3', price: 15 },
  ]);
});

afterAll(async () => {
  await server.close();
  await setup.stop();
});

describe('GET /restaurants', () => {
  test('returns 200 and array with pagination meta', async () => {
    const res = await request(server).get('/restaurants').expect(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('meta');
    expect(res.headers).toHaveProperty('x-total-count');
  });
});

describe('Auth and RBAC', () => {
  let adminToken;
  let userToken;

  test('login returns token', async () => {
    const a = await request(server)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' })
      .expect(200);
    const u = await request(server)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password' })
      .expect(200);
    adminToken = a.body.data.token;
    userToken = u.body.data.token;
    expect(adminToken).toBeDefined();
    expect(userToken).toBeDefined();
  });

  test('non-auth cannot create restaurant (401)', async () => {
    await request(server).post('/restaurants').send({ name: 'New' }).expect(401);
  });

  test('user (non-admin) cannot create restaurant (403)', async () => {
    await request(server)
      .post('/restaurants')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'New' })
      .expect(403);
  });

  test('admin can create restaurant (201)', async () => {
    const res = await request(server)
      .post('/restaurants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'New Resto' })
      .expect(201);
    expect(res.body.data).toHaveProperty('name', 'New Resto');
  });
});

describe('Users self-update/delete', () => {
  test('user can update self but not others', async () => {
    // login user
    const login = await request(server)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password' })
      .expect(200);
    const token = login.body.data.token;
    const me = await User.findOne({ email: 'user@example.com' }).lean();
    await request(server)
      .put(`/users/${me._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'user2' })
      .expect(200);

    // try to update other user
    const other = await User.findOne({ email: 'admin@example.com' }).lean();
    await request(server)
      .put(`/users/${other._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'hacked' })
      .expect(403);
  });
});

describe('Menus sorting & pagination', () => {
  test('menus can be sorted by price and paginated', async () => {
    const res = await request(server).get('/menus?sort=price&order=asc&page=1&limit=2').expect(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body).toHaveProperty('meta');
  });
});
