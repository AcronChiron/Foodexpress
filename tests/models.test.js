const Restaurant = require('../src/models/Restaurant');
const Menu = require('../src/models/Menu');

describe('model validations', () => {
  test('Restaurant phone validator rejects bad number', async () => {
    const r = new Restaurant({ name: 'T', phone: 'abc' });
    const err = r.validateSync();
    expect(err).toBeDefined();
    expect(err.errors).toHaveProperty('phone');
  });

  test('Menu price min validation', async () => {
    const m = new Menu({ restaurant_id: '000000000000000000000000', name: 'Dish', price: -5 });
    const err = m.validateSync();
    expect(err).toBeDefined();
    expect(err.errors).toHaveProperty('price');
  });
});
