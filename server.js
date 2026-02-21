/**
 * server.js
 * ----------
 * This is the runtime entry point used in production/local run.
 * It imports the configured Express app and starts listening on a port.
 */
const app = require("./app");

// Use environment-provided port when available (useful on cloud platforms).
// Fallback to 3000 for local development.
const PORT = process.env.PORT || 3000;

// Start the HTTP server.
app.listen(PORT, () => {
  // Log a simple message so beginners know the server started successfully.
  console.log(`Server running on port ${PORT}`);
});
