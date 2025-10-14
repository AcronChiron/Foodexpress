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

/**
 * @openapi
 * /restaurants:
 *   get:
 *     tags:
 *       - Restaurants
 *     summary: List restaurants (supports pagination)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurant'
 *                 meta:
 *                   type: object
 *     x-code-samples:
 *       - lang: cURL
 *         source: |
 *           curl -X GET 'http://localhost:3000/restaurants?page=1&limit=10'
 *   post:
 *     tags:
 *       - Restaurants
 *     summary: Create a restaurant (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 *     x-code-samples:
 *       - lang: cURL
 *         source: |
 *           curl -X POST http://localhost:3000/restaurants \
 *             -H "Authorization: Bearer <token>" \
 *             -H "Content-Type: application/json" \
 *             -d '{"name":"Chez Nous","address":"123 rue","phone":"0123456789"}'
 */
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
