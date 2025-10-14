const express = require('express');
const validationMiddleware = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const {
  listMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  createSchema,
  updateSchema,
} = require('../controllers/menuController');

const router = express.Router();

router.get('/', listMenus);
router.get('/:id', getMenu);

// Admin-only CUD
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  validationMiddleware(createSchema),
  createMenu,
);
router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  validationMiddleware(updateSchema),
  updateMenu,
);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteMenu);

module.exports = router;
