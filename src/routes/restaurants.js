const express = require('express');
const validationMiddleware = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const {
  listRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createSchema,
  updateSchema,
} = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', listRestaurants);
router.get('/:id', getRestaurant);

// Admin-only CUD
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  validationMiddleware(createSchema),
  createRestaurant,
);
router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  validationMiddleware(updateSchema),
  updateRestaurant,
);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteRestaurant);

module.exports = router;
