const express = require('express');
const validationMiddleware = require('../middleware/validation');
const { login, loginSchema } = require('../controllers/authController');

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login and receive JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: admin@example.com
 *             password: password
 *     responses:
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 value:
 *                   data:
 *                     token: "eyJhbGci..."
 *                     user:
 *                       _id: "64b..."
 *                       email: admin@example.com
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *     x-code-samples:
 *       - lang: cURL
 *         source: |
 *           curl -X POST http://localhost:3000/auth/login \
 *             -H "Content-Type: application/json" \
 *             -d '{"email":"admin@example.com","password":"password"}'
 */
router.post('/login', validationMiddleware(loginSchema), login);

module.exports = router;
