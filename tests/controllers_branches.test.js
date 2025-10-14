jest.mock('../src/models/User');
jest.mock('../src/models/Restaurant');
jest.mock('../src/models/Menu');

const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');
const Menu = require('../src/models/Menu');

const userCtrl = require('../src/controllers/userController');
const restCtrl = require('../src/controllers/restaurantController');
const menuCtrl = require('../src/controllers/menuController');
const authCtrl = require('../src/controllers/authController');

describe('controller catch branches', () => {
  beforeEach(() => jest.resetAllMocks());

  test('userController.getUser -> db throws -> next called', async () => {
    User.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await userCtrl.getUser({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('userController.updateUser -> findById throws -> next called', async () => {
    User.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await userCtrl.updateUser({ params: { id: '1' }, body: {} }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('userController.deleteUser -> findByIdAndDelete throws -> next called', async () => {
    User.findByIdAndDelete = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await userCtrl.deleteUser({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('restaurantController.getRestaurant -> findById throws -> next called', async () => {
    Restaurant.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await restCtrl.getRestaurant({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('restaurantController.updateRestaurant -> findById throws -> next called', async () => {
    Restaurant.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await restCtrl.updateRestaurant({ params: { id: '1' }, body: {} }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('restaurantController.deleteRestaurant -> findByIdAndDelete throws -> next called', async () => {
    Restaurant.findByIdAndDelete = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await restCtrl.deleteRestaurant({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('menuController.getMenu -> findById throws -> next called', async () => {
    Menu.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await menuCtrl.getMenu({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('menuController.updateMenu -> findById throws -> next called', async () => {
    Menu.findById = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await menuCtrl.updateMenu({ params: { id: '1' }, body: {} }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('menuController.deleteMenu -> findByIdAndDelete throws -> next called', async () => {
    Menu.findByIdAndDelete = jest.fn().mockImplementation(() => {
      throw new Error('db');
    });
    const next = jest.fn();
    await menuCtrl.deleteMenu({ params: { id: '1' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });

  test('authController.login -> comparePassword throws -> next called', async () => {
    const user = {
      comparePassword: jest.fn().mockImplementation(() => {
        throw new Error('bad');
      }),
    };
    User.findOne = jest.fn().mockReturnValue({ select: () => Promise.resolve(user) });
    const next = jest.fn();
    await authCtrl.login({ body: { email: 'a', password: 'p' } }, {}, next);
    expect(next).toHaveBeenCalled();
  });
});
