jest.mock('../src/models/Menu');
const Menu = require('../src/models/Menu');
const {
  listMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require('../src/controllers/menuController');

function makeRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.set = jest.fn();
  res.end = jest.fn();
  return res;
}

describe('menuController', () => {
  beforeEach(() => jest.resetAllMocks());

  test('listMenus returns meta and X-Total-Count', async () => {
    const req = { query: {}, params: {} };
    const items = [{ name: 'Dish' }];
    Menu.find = jest
      .fn()
      .mockReturnValue({
        sort: () => ({ skip: () => ({ limit: () => ({ lean: () => Promise.resolve(items) }) }) }),
      });
    Menu.countDocuments = jest.fn().mockResolvedValue(1);
    const res = makeRes();
    const next = jest.fn();
    await listMenus(req, res, next);
    expect(res.set).toHaveBeenCalledWith('X-Total-Count', '1');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: items }));
  });

  test('getMenu not found -> next 404', async () => {
    const req = { params: { id: '1' } };
    Menu.findById = jest.fn().mockReturnValue({ lean: () => Promise.resolve(null) });
    const next = jest.fn();
    await getMenu(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(404);
  });

  test('createMenu success', async () => {
    const req = { body: { name: 'New' } };
    const saveMock = jest.fn().mockResolvedValue();
    Menu.mockImplementation(() => ({ save: saveMock, toJSON: () => ({ name: 'New' }) }));
    const res = makeRes();
    const next = jest.fn();
    await createMenu(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('updateMenu not found -> next 404', async () => {
    const req = { params: { id: '1' }, body: {} };
    Menu.findById = jest.fn().mockResolvedValue(null);
    const next = jest.fn();
    await updateMenu(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(404);
  });

  test('deleteMenu not found -> next 404', async () => {
    const req = { params: { id: '1' } };
    Menu.findByIdAndDelete = jest.fn().mockReturnValue({ lean: () => Promise.resolve(null) });
    const next = jest.fn();
    await deleteMenu(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(404);
  });
});
