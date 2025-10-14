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

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: user@example.com
 *             username: alice
 *             password: secret
 *     responses:
 *       201:
 *         $ref: '#/components/responses/CreatedUser'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *     x-code-samples:
 *       - lang: cURL
 *         source: |
 *           curl -X POST http://localhost:3000/users \
 *             -H "Content-Type: application/json" \
 *             -d '{"email":"user@example.com","username":"alice","password":"secret"}'
 */
router.post('/', validationMiddleware(userCreateSchema), register);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by id (self or admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/OKUser'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *     x-code-samples:
 *       - lang: cURL
 *         source: |
 *           curl -X GET http://localhost:3000/users/64b... \
 *             -H "Authorization: Bearer <token>"
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user (self or admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/OKUser'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *     x-code-samples:
 *       - lang: cURL
 *         source: |
 *           curl -X PUT http://localhost:3000/users/64b... \
 *             -H "Authorization: Bearer <token>" \
 *             -H "Content-Type: application/json" \
 *             -d '{"username":"newname"}'
 *       - lang: cURL
 *         source: |
 *           curl -X PUT http://localhost:3000/users/64b... \
 *             -H "Authorization: Bearer <token>" \
 *             -H "Content-Type: application/json" \
 *             -d '{"username":"newname"}'
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user (self or admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     x-code-samples:
 *       - lang: cURL
 *         source: |
 *           curl -X DELETE http://localhost:3000/users/64b... \
 *             -H "Authorization: Bearer <token>"
 */
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
