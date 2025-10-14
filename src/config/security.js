const rateLimit = require('express-rate-limit');

function getCorsOptionsFromEnv() {
  const raw = process.env.CORS_ALLOWLIST || '';
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (list.length === 0) return true; // allow all when not set
  return {
    origin(origin, callback) {
      // allow requests with no origin (e.g., curl, mobile)
      if (!origin) return callback(null, true);
      if (list.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
  };
}

function createRateLimiter() {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000; // 15 minutes
  const max = parseInt(process.env.RATE_LIMIT_MAX, 10) || 100; // limit each IP to 100 requests per windowMs
  return rateLimit({ windowMs, max });
}

module.exports = {
  getCorsOptionsFromEnv,
  createRateLimiter,
};
