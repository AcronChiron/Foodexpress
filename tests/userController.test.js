jest.mock('../src/models/User');
const User = require('../src/models/User');
const { updateUser, deleteUser } = require('../src/controllers/userController');

describe('userController update/delete', () => {
  beforeEach(() => jest.resetAllMocks());

  test('updateUser not found -> next 404', async () => {
    const req = { params: { id: '1' }, body: {} };
    User.findById = jest.fn().mockResolvedValue(null);
    const next = jest.fn();
    await updateUser(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(404);
  });

  test('deleteUser not found -> next 404', async () => {
    const req = { params: { id: '1' } };
    User.findByIdAndDelete = jest.fn().mockReturnValue({ lean: () => Promise.resolve(null) });
    const next = jest.fn();
    await deleteUser(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(404);
  });
});
