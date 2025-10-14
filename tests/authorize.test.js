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
