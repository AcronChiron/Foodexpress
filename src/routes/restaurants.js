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
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
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
/**
 * @openapi
 * /restaurants/{id}:
 *   get:
 *     tags:
 *       - Restaurants
 *     summary: Get a restaurant by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The restaurant ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *             example:
 *               _id: "60d5ecb74b24c72b8c8b4567"
 *               name: "Chez Nous"
 *               address: "123 rue de la Paix"
 *               phone: "0123456789"
 *               opening_hours: "10:00-22:00"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', getRestaurant);

// Admin-only CUD
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  validationMiddleware(createSchema),
  createRestaurant,
);
/**
 * @openapi
 * /restaurants/{id}:
 *   put:
 *     tags:
 *       - Restaurants
 *     summary: Update a restaurant (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The restaurant ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *           example:
 *             name: "Chez Nous Updated"
 *             address: "456 Avenue de la Liberté"
 *             phone: "0987654321"
 *             opening_hours: "11:00-23:00"
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 *     x-code-samples:
 *       - lang: cURL
 *         source: |
 *           curl -X PUT http://localhost:3000/restaurants/{id} \
 *             -H "Authorization: Bearer <token>" \
 *             -H "Content-Type: application/json" \
 *             -d '{"name":"Chez Nous Updated","address":"456 Avenue de la Liberté","phone":"0987654321"}'
 */
router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  validationMiddleware(updateSchema),
  updateRestaurant,
);
/**
 * @openapi
 * /restaurants/{id}:
 *   delete:
 *     tags:
 *       - Restaurants
 *     summary: Delete a restaurant (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The restaurant ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: No Content
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 */
router.delete('/:id', authMiddleware, requireRole('admin'), deleteRestaurant);

module.exports = router;
