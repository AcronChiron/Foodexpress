require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connect: connectDb } = require('./config/mongodb');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDb();
  } catch (err) {
    logger.error('Warning: database connection failed. Starting server without DB.');
  }

  const server = http.createServer(app);
  server.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
  return server;
}

module.exports = start();
