const express = require('express');
const validationMiddleware = require('../middleware/validation');
const { login, loginSchema } = require('../controllers/authController');

const router = express.Router();

router.post('/login', validationMiddleware(loginSchema), login);

module.exports = router;
