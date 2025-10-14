const request = require('supertest');
const setup = require('../setup');

// Use real models and a real app instance for integration tests
let serverInstance;
let RestaurantModel;
let MenuModel;
let UserModel;

beforeAll(async () => {
  jest.resetModules();
  await setup.start();
  // require the app after starting in-memory mongo
  const app = require('../../src/app');
  serverInstance = app.listen(0);

  // require real models
  RestaurantModel = require('../../src/models/Restaurant');
  MenuModel = require('../../src/models/Menu');
  UserModel = require('../../src/models/User');

  // seed data
  await UserModel.create([
    { email: 'admin@example.com', username: 'admin', password: 'password', role: 'admin' },
    { email: 'user@example.com', username: 'user', password: 'password', role: 'user' },
  ]);

  const restaurants = await RestaurantModel.create([
    { name: 'Resto A', address: 'Addr A' },
    { name: 'Resto B', address: 'Addr B' },
  ]);

  await MenuModel.create([
    { restaurant_id: restaurants[0]._id, name: 'Dish 1', price: 5 },
    { restaurant_id: restaurants[0]._id, name: 'Dish 2', price: 10 },
    { restaurant_id: restaurants[1]._id, name: 'Dish 3', price: 15 },
  ]);
});

afterAll(async () => {
  await serverInstance.close();
  await setup.stop();
});

describe('integration: restaurants listing and auth flows', () => {
  test('GET /restaurants returns 200 and array with pagination meta', async () => {
    const res = await request(serverInstance).get('/restaurants').expect(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('meta');
    expect(res.headers).toHaveProperty('x-total-count');
  });

  test('Auth and RBAC flows (login/create restaurant)', async () => {
    const a = await request(serverInstance)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' })
      .expect(200);
    const u = await request(serverInstance)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password' })
      .expect(200);
    const adminToken = a.body.data.token;
    const userToken = u.body.data.token;
    expect(adminToken).toBeDefined();
    expect(userToken).toBeDefined();

    await request(serverInstance).post('/restaurants').send({ name: 'New' }).expect(401);

    await request(serverInstance)
      .post('/restaurants')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'New' })
      .expect(403);

    const res = await request(serverInstance)
      .post('/restaurants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'New Resto' })
      .expect(201);
    expect(res.body.data).toHaveProperty('name', 'New Resto');
  });

  test('Users self-update/delete flows', async () => {
    const login = await request(serverInstance)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password' })
      .expect(200);
    const token = login.body.data.token;
    const me = await UserModel.findOne({ email: 'user@example.com' }).lean();
    await request(serverInstance)
      .put(`/users/${me._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'user2' })
      .expect(200);

    const other = await UserModel.findOne({ email: 'admin@example.com' }).lean();
    await request(serverInstance)
      .put(`/users/${other._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'hacked' })
      .expect(403);
  });

  test('Menus sorting & pagination', async () => {
    const res = await request(serverInstance)
      .get('/menus?sort=price&order=asc&page=1&limit=2')
      .expect(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body).toHaveProperty('meta');
  });
});

// duplicate-create e2e case
describe('creating duplicate user returns 409 via error handler', () => {
  test('duplicate user creation returns 409', async () => {
    // create one user via model directly
    await UserModel.create({ email: 'dup@example.com', username: 'dup', password: 'password' });
    // attempt to create same user via API
    const res = await request(serverInstance)
      .post('/users')
      .send({ email: 'dup@example.com', username: 'dup2', password: 'password' });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });
});
