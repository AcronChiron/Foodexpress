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

/**
 * @openapi
 * /menus:
 *   get:
 *     tags:
 *       - Menus
 *     summary: List menus (filter, sort, paginate)
 *     parameters:
 *       - in: query
 *         name: restaurant_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
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
 *                     $ref: '#/components/schemas/Menu'
 *                 meta:
 *                   type: object
 *     x-code-samples:
 *       - lang: cURL
 *         source: |
 *           curl -X GET 'http://localhost:3000/menus?restaurant_id=64b...&page=1'
 *   post:
 *     tags:
 *       - Menus
 *     summary: Create menu (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
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
 *           curl -X POST http://localhost:3000/menus \
 *             -H "Authorization: Bearer <token>" \
 *             -H "Content-Type: application/json" \
 *             -d '{"restaurant_id":"64b...","name":"Pizza","price":9.5}'
 */
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
