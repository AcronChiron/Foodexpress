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
    errorHandler(err, {}, res, () => {});
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
