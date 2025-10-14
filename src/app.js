const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { getCorsOptionsFromEnv, createRateLimiter } = require('./config/security');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(helmet());
// Rate limiter
app.use(createRateLimiter());
// CORS: allowlist via CORS_ALLOWLIST env (comma separated). If not set allow all.
app.use(cors(getCorsOptionsFromEnv()));
app.use(express.json());
app.use(morgan('dev'));

// Swagger UI (optional)
try {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (e) {
  // swagger-ui-express not installed — skip mounting docs
}

// Sanity route
app.get('/health', (req, res) => {
  res.json({ data: { status: 'ok' } });
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
