jest.mock('../src/models/User');
const User = require('../src/models/User');
const { register, updateUser, deleteUser } = require('../src/controllers/userController');
const { login } = require('../src/controllers/authController');

describe('users - register/login/update/delete', () => {
  beforeEach(() => jest.resetAllMocks());

  test('register -> conflict when existing user', async () => {
    const req = { body: { email: 'a@b', username: 'u', password: 'p' } };
    User.findOne = jest.fn().mockReturnValue({ lean: () => Promise.resolve({ email: 'a@b' }) });
    const next = jest.fn();
    await register(req, {}, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(409);
  });

  test('register -> creates user on success', async () => {
    const req = { body: { email: 'new@b', username: 'nu', password: 'p' } };
    User.findOne = jest.fn().mockReturnValue({ lean: () => Promise.resolve(null) });
    const saveMock = jest.fn().mockResolvedValue();
    // emulate constructor returning object with save method and toJSON
    User.mockImplementation(() => ({ save: saveMock, toJSON: () => ({ email: 'new@b' }) }));
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    await register(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: { email: 'new@b' } });
  });

  test('login -> invalid credentials when user not found', async () => {
    const req = { body: { email: 'x', password: 'p' } };
    User.findOne = jest.fn().mockReturnValue({ select: () => Promise.resolve(null) });
    const next = jest.fn();
    await login(req, {}, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(401);
  });

  test('login -> invalid credentials when password mismatch', async () => {
    const req = { body: { email: 'x', password: 'p' } };
    const user = { comparePassword: jest.fn().mockResolvedValue(false) };
    User.findOne = jest.fn().mockReturnValue({ select: () => Promise.resolve(user) });
    const next = jest.fn();
    await login(req, {}, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(401);
  });

  test('updateUser -> not found -> next 404', async () => {
    const req = { params: { id: '1' }, body: {} };
    User.findById = jest.fn().mockResolvedValue(null);
    const next = jest.fn();
    await updateUser(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(404);
  });

  test('updateUser -> save throws error -> next called', async () => {
    const req = { params: { id: '1' }, body: { username: 'x' } };
    const user = { save: jest.fn().mockRejectedValue(new Error('save failed')) };
    User.findById = jest.fn().mockResolvedValue(user);
    const next = jest.fn();
    await updateUser(req, {}, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
  });

  test('deleteUser -> not found -> next 404', async () => {
    const req = { params: { id: '1' } };
    User.findByIdAndDelete = jest.fn().mockReturnValue({ lean: () => Promise.resolve(null) });
    const next = jest.fn();
    await deleteUser(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(404);
  });

  test('getUser -> success returns data', async () => {
    const req = { params: { id: '1' } };
    const user = { _id: '1', email: 'a@b' };
    User.findById = jest.fn().mockReturnValue({ lean: () => Promise.resolve(user) });
    const res = { json: jest.fn() };
    const next = jest.fn();
    await require('../src/controllers/userController').getUser(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ data: user });
  });

  test('updateUser -> success', async () => {
    const req = { params: { id: '1' }, body: { username: 'new' } };
    const user = { save: jest.fn().mockResolvedValue(), toJSON: () => ({ username: 'new' }) };
    User.findById = jest.fn().mockResolvedValue(user);
    const res = { json: jest.fn() };
    const next = jest.fn();
    await updateUser(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ data: { username: 'new' } });
  });

  test('deleteUser -> success 204', async () => {
    const req = { params: { id: '1' } };
    User.findByIdAndDelete = jest
      .fn()
      .mockReturnValue({ lean: () => Promise.resolve({ _id: '1' }) });
    const res = { status: jest.fn(() => res), end: jest.fn() };
    const next = jest.fn();
    await deleteUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });
});
// Placeholder test for users
test('placeholder users test', () => {
  expect(true).toBe(true);
});
