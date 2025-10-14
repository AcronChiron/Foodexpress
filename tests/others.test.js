// Consolidated tests for non-resource-specific suites
// This file gathers app routes, authorization, controller branches,
// error handler, middleware, schemas, security, utils and model tests.

const request = require('supertest');
const app = require('../src/app');

describe('app routes', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  test('unknown route returns 404 JSON', async () => {
    const res = await request(app).get('/this-route-does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// --- authorize middleware tests ---
const { requireRole, requireSelfOrRole } = require('../src/middleware/authorize');

describe('authorize middleware', () => {
  test('requireRole -> unauthorized when no user', () => {
    const mw = requireRole('admin');
    const next = jest.fn();
    mw({}, {}, next);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(401);
  });

  test('requireRole -> forbidden when wrong role', () => {
    const mw = requireRole('admin');
    const req = { user: { role: 'user' } };
    const next = jest.fn();
    mw(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(403);
  });

  test('requireRole -> allowed when role matches', () => {
    const mw = requireRole('admin');
    const req = { user: { role: 'admin' } };
    const next = jest.fn();
    mw(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('requireSelfOrRole -> unauthorized when no user', () => {
    const mw = requireSelfOrRole('id', 'admin');
    const next = jest.fn();
    mw({}, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(401);
  });

  test('requireSelfOrRole -> allowed when self', () => {
    const mw = requireSelfOrRole('id', 'admin');
    const req = { user: { id: '1', role: 'user' }, params: { id: '1' } };
    const next = jest.fn();
    mw(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('requireSelfOrRole -> allowed when role matches', () => {
    const mw = requireSelfOrRole('id', 'admin');
    const req = { user: { id: '2', role: 'admin' }, params: { id: '1' } };
    const next = jest.fn();
    mw(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('requireSelfOrRole -> forbidden otherwise', () => {
    const mw = requireSelfOrRole('id', 'admin');
    const req = { user: { id: '2', role: 'user' }, params: { id: '1' } };
    const next = jest.fn();
    mw(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(403);
  });
});

// --- controller catch-branch tests ---
jest.mock('../src/models/User');
jest.mock('../src/models/Restaurant');
jest.mock('../src/models/Menu');

const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');
const Menu = require('../src/models/Menu');

const userCtrl = require('../src/controllers/userController');
const restCtrl = require('../src/controllers/restaurantController');
const menuCtrl = require('../src/controllers/menuController');
const authCtrl = require('../src/controllers/authController');

// make jwt utils available early for tests that create tokens
const { signToken, verifyToken } = require('../src/utils/jwt');

describe('controller catch branches', () => {
  beforeEach(() => jest.resetAllMocks());

  test('userController.getUser -> db throws -> next called', async () => {
    User.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await userCtrl.getUser({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('userController.updateUser -> findById throws -> next called', async () => {
    User.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await userCtrl.updateUser({ params: { id: '1' }, body: {} }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('userController.deleteUser -> findByIdAndDelete throws -> next called', async () => {
    User.findByIdAndDelete = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await userCtrl.deleteUser({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('restaurantController.getRestaurant -> findById throws -> next called', async () => {
    Restaurant.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await restCtrl.getRestaurant({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('restaurantController.updateRestaurant -> findById throws -> next called', async () => {
    Restaurant.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await restCtrl.updateRestaurant({ params: { id: '1' }, body: {} }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('restaurantController.deleteRestaurant -> findByIdAndDelete throws -> next called', async () => {
    Restaurant.findByIdAndDelete = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await restCtrl.deleteRestaurant({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('menuController.getMenu -> findById throws -> next called', async () => {
    Menu.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await menuCtrl.getMenu({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('menuController.updateMenu -> findById throws -> next called', async () => {
    Menu.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await menuCtrl.updateMenu({ params: { id: '1' }, body: {} }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('menuController.deleteMenu -> findByIdAndDelete throws -> next called', async () => {
    Menu.findByIdAndDelete = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await menuCtrl.deleteMenu({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('authController.login -> comparePassword throws -> next called', async () => {
    const user = {
      comparePassword: jest.fn().mockImplementation(() => {
        throw new Error('bad');
      }),
    };
    User.findOne = jest.fn().mockReturnValue({ select: () => Promise.resolve(user) });
    const next = jest.fn();
    await authCtrl.login({ body: { email: 'a', password: 'p' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });
});

// --- extra coverage & auth header format ---
jest.resetModules();
jest.mock('../src/models/User');
jest.mock('../src/models/Restaurant');
jest.mock('../src/models/Menu');

// get fresh references to the mocked modules so we can configure them below
const MockedUser = require('../src/models/User');
const MockedRestaurant = require('../src/models/Restaurant');
const MockedMenu = require('../src/models/Menu');

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
    MockedUser.findOne = jest.fn().mockReturnValue({ select: () => Promise.resolve(user) });
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

// --- model toJSON behaviors ---
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

// --- errorHandler tests ---
const errorHandler = require('../src/middleware/errorHandler');

function makeRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('errorHandler branches', () => {
  test('handles Joi validation error -> 400', () => {
    const err = new Error('Bad');
    err.isJoi = true;
    err.details = [{ message: 'must be', path: ['email'] }];
    const res = makeRes();
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Object) }));
  });

  test('handles Mongoose ValidationError -> 422', () => {
    const err = { name: 'ValidationError', errors: { email: { message: 'err', path: 'email' } } };
    const res = makeRes();
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(422);
  });

  test('handles CastError -> 400', () => {
    const err = { name: 'CastError', path: 'id' };
    const res = makeRes();
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('handles duplicate key -> 409', () => {
    const err = { code: 11000, keyValue: { email: 'a@b' } };
    const res = makeRes();
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('handles JWT errors -> 401', () => {
    const err = new Error('jwt');
    err.name = 'JsonWebTokenError';
    const res = makeRes();
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('handles SyntaxError body parser -> 400', () => {
    const err = new SyntaxError('bad JSON');
    err.status = 400;
    err.body = true;
    const res = makeRes();
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('falls back to 500', () => {
    const err = new Error('boom');
    const res = makeRes();
    // suppress console.error output during this test to keep test output clean
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      errorHandler(err, {}, res, () => {});
      expect(res.status).toHaveBeenCalledWith(500);
    } finally {
      spy.mockRestore();
    }
  });
});

// --- jwt options ---
// jwt utils already required earlier in this file
describe('jwt options', () => {
  test('signToken accepts custom expiresIn option', () => {
    const token = signToken({ id: '1' }, { expiresIn: '2h' });
    const payload = verifyToken(token);
    expect(payload).toHaveProperty('id', '1');
  });
});

// --- validation/auth/middleware tests ---
const validationMiddleware = require('../src/middleware/validation');

const Joi = require('joi');

describe('validationMiddleware', () => {
  test('rejects invalid payload', async () => {
    const schema = Joi.object({ name: Joi.string().required() });
    const mw = validationMiddleware(schema);
    const req = { body: {} };
    const res = {};
    const next = jest.fn();
    await mw(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('authMiddleware', () => {
  test('rejects missing header', async () => {
    const req = { headers: {} };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(401);
  });

  test('authMiddleware success attaches req.user', async () => {
    const token = signToken({ id: 'abc', role: 'user' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();
    await authMiddleware(req, res, next);
    expect(req.user).toHaveProperty('id', 'abc');
    expect(req.user).toHaveProperty('role', 'user');
  });

  describe('auth jwt edge cases', () => {
    test('authMiddleware accepts capitalized Authorization header', async () => {
      const token = signToken({ id: 'cap', role: 'user' });
      const req = { headers: { Authorization: `Bearer ${token}` } };
      const res = {};
      const next = jest.fn();
      const auth = require('../src/middleware/auth');
      await auth(req, res, next);
      expect(req.user.id).toBe('cap');
    });

    test('verifyToken throws on bad token (auth middleware)', async () => {
      const req = { headers: { authorization: 'Bearer bad.token' } };
      const res = {};
      const next = jest.fn();
      const auth = require('../src/middleware/auth');
      await auth(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err.status).toBe(401);
    });
  });
});

describe('pagination aliases', () => {
  test('parsePagination and parseSort alias functions exist', () => {
    const { parsePagination, parseSort } = require('../src/utils/pagination');
    expect(typeof parsePagination).toBe('function');
    expect(typeof parseSort).toBe('function');
  });
});

// --- model validations ---

describe('model validations', () => {
  test('Restaurant phone validator rejects bad number', async () => {
    const R = jest.requireActual('../src/models/Restaurant');
    const r = new R({ name: 'T', phone: 'abc' });
    const err = r.validateSync();
    expect(err).toBeDefined();
    expect(err.errors).toHaveProperty('phone');
  });

  test('Menu price min validation', async () => {
    const M = jest.requireActual('../src/models/Menu');
    const m = new M({ restaurant_id: '000000000000000000000000', name: 'Dish', price: -5 });
    const err = m.validateSync();
    expect(err).toBeDefined();
    expect(err.errors).toHaveProperty('price');
  });

  test('Restaurant phone empty is allowed', () => {
    const R2 = jest.requireActual('../src/models/Restaurant');
    const r = new R2({ name: 'T' });
    const err = r.validateSync();
    expect(err).toBeUndefined();
  });
});

// --- exported Joi schemas ---
const { userCreateSchema, userUpdateSchema } = require('../src/controllers/userController');
const { createSchema: restaurantCreate } = require('../src/controllers/restaurantController');
const { createSchema: menuCreate } = require('../src/controllers/menuController');

describe('exported Joi schemas', () => {
  test('userCreateSchema rejects missing fields', () => {
    const { error } = userCreateSchema.validate({});
    expect(error).toBeDefined();
  });

  test('userUpdateSchema requires at least one field', () => {
    const { error } = userUpdateSchema.validate({});
    expect(error).toBeDefined();
  });

  test('restaurant create schema accepts minimal payload', () => {
    const { error } = restaurantCreate.validate({ name: 'X' });
    expect(error).toBeUndefined();
  });

  test('menu create schema validates price min', () => {
    const { error } = menuCreate.validate({ restaurant_id: '1', name: 'n', price: -1 });
    expect(error).toBeDefined();
  });
});

// --- security config ---
const { getCorsOptionsFromEnv, createRateLimiter } = require('../src/config/security');

describe('security config', () => {
  const OLD = process.env.CORS_ALLOWLIST;
  afterEach(() => {
    process.env.CORS_ALLOWLIST = OLD;
    delete process.env.RATE_LIMIT_WINDOW_MS;
    delete process.env.RATE_LIMIT_MAX;
  });

  test('getCorsOptionsFromEnv allows all when env not set', () => {
    delete process.env.CORS_ALLOWLIST;
    const opts = getCorsOptionsFromEnv();
    expect(opts).toBe(true);
  });

  test('getCorsOptionsFromEnv returns origin checker when set', (done) => {
    process.env.CORS_ALLOWLIST = 'https://example.com';
    const opts = getCorsOptionsFromEnv();
    expect(typeof opts.origin).toBe('function');
    opts.origin('https://example.com', (err, ok) => {
      expect(err).toBeNull();
      expect(ok).toBe(true);
      opts.origin('https://bad.com', (err2) => {
        expect(err2).toBeInstanceOf(Error);
        done();
      });
    });
  });

  test('createRateLimiter returns a middleware function', () => {
    delete process.env.RATE_LIMIT_WINDOW_MS;
    delete process.env.RATE_LIMIT_MAX;
    const rl = createRateLimiter();
    expect(typeof rl).toBe('function');
  });
});

// --- pagination & jwt utils ---
const { getPagination, getSort } = require('../src/utils/pagination');

describe('pagination utils', () => {
  test('getPagination defaults', () => {
    const req = { query: {} };
    const { page, limit, skip } = getPagination(req);
    expect(page).toBe(1);
    expect(limit).toBe(10);
    expect(skip).toBe(0);
  });

  test('getSort returns order', () => {
    const req = { query: { sort: 'price', order: 'desc' } };
    const sort = getSort(req, 'name');
    expect(sort).toEqual({ price: -1 });
  });

  test('getFilters supports q and ranges', () => {
    const req = { query: { q: 'resto', price_min: '5', price_max: '20', category: 'main' } };
    const f = require('../src/utils/pagination').getFilters(req, [
      'q',
      'price_min',
      'price_max',
      'category',
    ]);
    expect(f).toHaveProperty('$or');
    expect(f).toHaveProperty('price');
    expect(f.price).toHaveProperty('$gte');
    expect(f.price).toHaveProperty('$lte');
    expect(f.category).toBe('main');
  });
});

describe('jwt utils', () => {
  test('sign and verify', () => {
    const token = signToken({ id: '123', role: 'user' });
    const payload = verifyToken(token);
    expect(payload).toHaveProperty('id', '123');
    expect(payload).toHaveProperty('role', 'user');
  });
});

// Integration tests were moved into tests/integration/others.integration.test.js
