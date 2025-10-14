const { signToken, verifyToken } = require('../src/utils/jwt');

describe('jwt options', () => {
  test('signToken accepts custom expiresIn option', () => {
    const token = signToken({ id: '1' }, { expiresIn: '2h' });
    const payload = verifyToken(token);
    expect(payload).toHaveProperty('id', '1');
  });
});
