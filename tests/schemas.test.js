const { userCreateSchema, userUpdateSchema } = require('../src/controllers/userController');
const { createSchema: restaurantCreate } = require('../src/controllers/restaurantController');
const { createSchema: menuCreate } = require('../src/controllers/menuController');

describe('exported Joi schemas', () => {
  test('userCreateSchema rejects missing fields', () => {
    const { error } = userCreateSchema.validate({});
    expect(error).toBeDefined();
  });

  test('userUpdateSchema requires at least one field', () => {
    const { error } = userUpdateSchema.validate({});
    expect(error).toBeDefined();
  });

  test('restaurant create schema accepts minimal payload', () => {
    const { error } = restaurantCreate.validate({ name: 'X' });
    expect(error).toBeUndefined();
  });

  test('menu create schema validates price min', () => {
    const { error } = menuCreate.validate({ restaurant_id: '1', name: 'n', price: -1 });
    expect(error).toBeDefined();
  });
});
