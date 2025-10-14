const mongoose = require('mongoose');
const logger = require('../utils/logger');

const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_BASE_DELAY_MS = 1000; // backoff base

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connect(uri = process.env.MONGO_URI, options = {}) {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const baseDelay = options.baseDelay ?? DEFAULT_BASE_DELAY_MS;

  if (!uri) {
    logger.warn('MONGO_URI not set — skipping MongoDB connection.');
    return;
  }

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err && err.message ? err.message : err}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      attempt += 1;
      // connect returns a promise
      // recommended options for modern mongoose; avoid deprecated driver options
      await mongoose.connect(uri, {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 5000,
        // other options can be passed via `options.mongooseOptions`
        ...(options.mongooseOptions || {}),
      });
      return; // success
    } catch (err) {
      logger.error(
        `MongoDB connection attempt ${attempt} failed: ${err && err.message ? err.message : err}`,
      );
      if (attempt > maxRetries) {
        logger.error('MongoDB: max retries reached, giving up.');
        throw err;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.info(`MongoDB: retrying in ${delay}ms...`);
      // wait then retry
      // eslint-disable-next-line no-await-in-loop
      await wait(delay);
    }
  }
}

function close() {
  return mongoose.disconnect();
}

module.exports = {
  connect,
  close,
  mongoose,
};
