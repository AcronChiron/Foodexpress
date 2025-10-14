const express = require('express');
const {
  register,
  userCreateSchema,
  getUser,
  updateUser,
  deleteUser,
  // userUpdateSchema is defined in controller and exported implicitly
} = require('../controllers/userController');
const validationMiddleware = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');
const { requireSelfOrRole } = require('../middleware/authorize');

// import update schema via a little require to avoid circularity
const { userUpdateSchema } = require('../controllers/userController');

const router = express.Router();

router.post('/', validationMiddleware(userCreateSchema), register);

router.get('/:id', authMiddleware, requireSelfOrRole('id', 'admin'), getUser);
router.put(
  '/:id',
  authMiddleware,
  requireSelfOrRole('id', 'admin'),
  validationMiddleware(userUpdateSchema),
  updateUser,
);
router.delete('/:id', authMiddleware, requireSelfOrRole('id', 'admin'), deleteUser);

module.exports = router;
