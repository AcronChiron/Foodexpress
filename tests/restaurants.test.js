// Placeholder test for restaurants
jest.mock('../src/models/Restaurant');
const Restaurant = require('../src/models/Restaurant');
const {
  listRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../src/controllers/restaurantController');

function makeRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.set = jest.fn();
  res.end = jest.fn();
  return res;
}

describe('restaurants - controller', () => {
  beforeEach(() => jest.resetAllMocks());

  test('listRestaurants uses filters and returns meta', async () => {
    const req = { query: {}, params: {} };
    const items = [{ name: 'A' }];
    Restaurant.find = jest.fn().mockReturnValue({
      sort: () => ({ skip: () => ({ limit: () => ({ lean: () => Promise.resolve(items) }) }) }),
    });
    Restaurant.countDocuments = jest.fn().mockResolvedValue(1);
    const res = makeRes();
    const next = jest.fn();
    await listRestaurants(req, res, next);
    expect(res.set).toHaveBeenCalledWith('X-Total-Count', '1');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: items }));
  });

  test('getRestaurant not found -> next 404', async () => {
    const req = { params: { id: '1' } };
    Restaurant.findById = jest.fn().mockReturnValue({ lean: () => Promise.resolve(null) });
    const next = jest.fn();
    await getRestaurant(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(404);
  });

  test('createRestaurant success', async () => {
    const req = { body: { name: 'New' } };
    const saveMock = jest.fn().mockResolvedValue();
    Restaurant.mockImplementation(() => ({ save: saveMock, toJSON: () => ({ name: 'New' }) }));
    const res = makeRes();
    const next = jest.fn();
    await createRestaurant(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('updateRestaurant not found -> next 404', async () => {
    const req = { params: { id: '1' }, body: {} };
    Restaurant.findById = jest.fn().mockResolvedValue(null);
    const next = jest.fn();
    await updateRestaurant(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(404);
  });

  test('deleteRestaurant not found -> next 404', async () => {
    const req = { params: { id: '1' } };
    Restaurant.findByIdAndDelete = jest.fn().mockReturnValue({ lean: () => Promise.resolve(null) });
    const next = jest.fn();
    await deleteRestaurant(req, {}, next);
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(404);
  });
});
