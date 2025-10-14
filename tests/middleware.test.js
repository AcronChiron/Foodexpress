const errorHandler = require('../src/middleware/errorHandler');
const validationMiddleware = require('../src/middleware/validation');
const authMiddleware = require('../src/middleware/auth');

// validationMiddleware returns a middleware function; we test it by calling with a simple schema
const Joi = require('joi');

describe('errorHandler', () => {
  test('formats Joi errors as 400', () => {
    const err = new Error('Validation failed');
    err.isJoi = true;
    err.details = [{ message: 'err', path: ['email'] }];
    const res = { status: jest.fn(() => res), json: jest.fn() };
    // call
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });
});

describe('validationMiddleware', () => {
  test('rejects invalid payload', async () => {
    const schema = Joi.object({ name: Joi.string().required() });
    const mw = validationMiddleware(schema);
    const req = { body: {} };
    const res = {};
    const next = jest.fn();
    await mw(req, res, next);
    // middleware should call next with an error
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
    // create a token using utils
    const { signToken } = require('../src/utils/jwt');
    const token = signToken({ id: 'abc', role: 'user' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();
    await authMiddleware(req, res, next);
    expect(req.user).toHaveProperty('id', 'abc');
    expect(req.user).toHaveProperty('role', 'user');
  });
});

describe('pagination aliases', () => {
  test('parsePagination and parseSort alias functions exist', () => {
    const { parsePagination, parseSort } = require('../src/utils/pagination');
    expect(typeof parsePagination).toBe('function');
    expect(typeof parseSort).toBe('function');
  });
});
