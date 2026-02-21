/**
 * server.js
 * ----------
 * This is the runtime entry point used in production/local run.
 * It imports the configured Express app and starts listening on a port.
 */
const app = require("./app");
const { connectDB, isMongoEnabled } = require("./config/db");

// Use environment-provided port when available (useful on cloud platforms).
// Fallback to 3000 for local development.
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    if (isMongoEnabled()) {
      await connectDB();
      console.log("MongoDB connected.");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
