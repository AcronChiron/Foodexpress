const { getPagination, getSort, getFilters } = require('../src/utils/pagination');
const { signToken, verifyToken } = require('../src/utils/jwt');

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
    const f = getFilters(req, ['q', 'price_min', 'price_max', 'category']);
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
