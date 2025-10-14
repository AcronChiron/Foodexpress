const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports = {
  async start() {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { dbName: 'testdb' });
    return uri;
  },
  async stop() {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  },
  getUri() {
    return mongoServer ? mongoServer.getUri() : null;
  },
};
