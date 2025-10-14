jest.mock('../src/models/User');
jest.mock('../src/models/Restaurant');
jest.mock('../src/models/Menu');

const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');
const Menu = require('../src/models/Menu');

const { login } = require('../src/controllers/authController');
const { listRestaurants } = require('../src/controllers/restaurantController');
const { listMenus } = require('../src/controllers/menuController');
const authMiddleware = require('../src/middleware/auth');
const { getFilters } = require('../src/utils/pagination');

describe('extra coverage: controllers error branches & auth header format', () => {
  beforeEach(() => jest.resetAllMocks());

  test('authController.login -> success returns token and user', async () => {
    const user = {
      _id: 'u1',
      role: 'user',
      comparePassword: jest.fn().mockResolvedValue(true),
      toJSON: () => ({ id: 'u1' }),
    };
    User.findOne = jest.fn().mockReturnValue({ select: () => Promise.resolve(user) });
    const req = { body: { email: 'a@b', password: 'p' } };
    const res = { json: jest.fn() };
    const next = jest.fn();
    await login(req, res, next);
    expect(res.json).toHaveBeenCalled();
    const arg = res.json.mock.calls[0][0];
    expect(arg).toHaveProperty('data.token');
    expect(arg.data).toHaveProperty('user');
  });

  test('listRestaurants -> DB error forwarded to next', async () => {
    Restaurant.find = jest.fn().mockImplementation(() => {
      throw new Error('db fail');
    });
    const req = { query: {}, params: {} };
    const res = { set: jest.fn(), json: jest.fn() };
    const next = jest.fn();
    await listRestaurants(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('listMenus -> DB error forwarded to next', async () => {
    Menu.find = jest.fn().mockImplementation(() => {
      throw new Error('db fail');
    });
    const req = { query: {}, params: {} };
    const res = { set: jest.fn(), json: jest.fn() };
    const next = jest.fn();
    await listMenus(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('authMiddleware -> wrong header format', async () => {
    const req = { headers: { authorization: 'Token abc' } };
    const res = {};
    const next = jest.fn();
    await authMiddleware(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(401);
  });

  test('getFilters supports search and name equality', () => {
    const req = { query: { search: 'foo', name: 'Bar', price_min: '2' } };
    const f = getFilters(req, ['search', 'name', 'price_min']);
    expect(f).toHaveProperty('$or');
    expect(f).toHaveProperty('name');
    expect(f).toHaveProperty('price');
  });
});

describe('model toJSON behaviors', () => {
  test('Menu toJSON removes __v', () => {
    const M = jest.requireActual('../src/models/Menu');
    const inst = new M({ restaurant_id: '000000000000000000000000', name: 'X', price: 1 });
    inst.__v = 10;
    const obj = inst.toJSON();
    expect(obj.__v).toBeUndefined();
  });

  test('Restaurant toJSON removes __v', () => {
    const R = jest.requireActual('../src/models/Restaurant');
    const inst = new R({ name: 'R' });
    inst.__v = 5;
    const obj = inst.toJSON();
    expect(obj.__v).toBeUndefined();
  });
});
