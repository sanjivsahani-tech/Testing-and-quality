const { MongoMemoryServer } = require("mongodb-memory-server");
const { connectDB, disconnectDB } = require("../../config/db");

async function startMongoMemoryServer() {
  const mongoServer = await MongoMemoryServer.create();
  process.env.USE_MONGO = "true";
  process.env.MONGO_URI = mongoServer.getUri();
  await connectDB();
  return mongoServer;
}

async function stopMongoMemoryServer(mongoServer) {
  await disconnectDB();
  if (mongoServer) {
    await mongoServer.stop();
  }
  delete process.env.USE_MONGO;
  delete process.env.MONGO_URI;
}

module.exports = {
  startMongoMemoryServer,
  stopMongoMemoryServer
};
