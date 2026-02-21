const mongoose = require("mongoose");

function isMongoEnabled() {
  return process.env.USE_MONGO === "true";
}

async function connectDB() {
  if (!isMongoEnabled()) {
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test_case";
  await mongoose.connect(uri);
  return true;
}

async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectDB,
  disconnectDB,
  isMongoEnabled
};
