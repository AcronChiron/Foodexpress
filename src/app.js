const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { getCorsOptionsFromEnv, createRateLimiter } = require('./config/security');
const morgan = require('morgan');
const logger = require('./utils/logger');
const { mongoose } = require('./config/mongodb');

const app = express();

// Middlewares
app.use(helmet());
// Rate limiter
app.use(createRateLimiter());
// CORS: allowlist via CORS_ALLOWLIST env (comma separated). If not set allow all.
app.use(cors(getCorsOptionsFromEnv()));
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

// Swagger UI (optional)
try {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./swagger');
  // UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // raw JSON for programmatic consumption
  app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
} catch (e) {
  // swagger-ui-express not installed — skip mounting docs
}

// Sanity route
/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check (liveness probe)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 */
app.get('/health', (req, res) => {
  res.json({ data: { status: 'ok' } });
});

// Readiness route
/**
 * @openapi
 * /health/ready:
 *   get:
 *     tags:
 *       - Health
 *     summary: Readiness check (database connectivity)
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ready
 *                     database:
 *                       type: string
 *                       example: connected
 *       503:
 *         description: Service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Service Unavailable
 */
app.get('/health/ready', (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    // connected
    res.json({ data: { status: 'ready', database: 'connected' } });
  } else {
    res.status(503).json({ error: { message: 'Service Unavailable', database: 'disconnected' } });
  }
});

// Routes
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
// Auth routes
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);
// Restaurants & Menus
const restaurantsRouter = require('./routes/restaurants');
app.use('/restaurants', restaurantsRouter);
const menusRouter = require('./routes/menus');
app.use('/menus', menusRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Not Found' } });
});

// Centralized error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
