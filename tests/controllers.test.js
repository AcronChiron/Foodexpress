jest.mock('../src/models/User');
const User = require('../src/models/User');
const { register } = require('../src/controllers/userController');
const { login } = require('../src/controllers/authController');

describe('userController.register', () => {
  beforeEach(() => jest.resetAllMocks());

  test('conflict when existing user', async () => {
    const req = { body: { email: 'a@b', username: 'u', password: 'p' } };
    User.findOne = jest.fn().mockReturnValue({ lean: () => Promise.resolve({ email: 'a@b' }) });
    const next = jest.fn();
    await register(req, {}, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(409);
  });

  test('creates user on success', async () => {
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
});

describe('authController.login', () => {
  beforeEach(() => jest.resetAllMocks());

  test('invalid credentials when user not found', async () => {
    const req = { body: { email: 'x', password: 'p' } };
    User.findOne = jest.fn().mockReturnValue({ select: () => Promise.resolve(null) });
    const next = jest.fn();
    await login(req, {}, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(401);
  });

  test('invalid credentials when password mismatch', async () => {
    const req = { body: { email: 'x', password: 'p' } };
    const user = { comparePassword: jest.fn().mockResolvedValue(false) };
    User.findOne = jest.fn().mockReturnValue({ select: () => Promise.resolve(user) });
    const next = jest.fn();
    await login(req, {}, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(401);
  });
});

describe('userController update error branch', () => {
  beforeEach(() => jest.resetAllMocks());

  test('save throws error -> next called', async () => {
    const { updateUser } = require('../src/controllers/userController');
    const req = { params: { id: '1' }, body: { username: 'x' } };
    const user = { save: jest.fn().mockRejectedValue(new Error('save failed')) };
    User.findById = jest.fn().mockResolvedValue(user);
    const next = jest.fn();
    await updateUser(req, {}, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
  });
});
