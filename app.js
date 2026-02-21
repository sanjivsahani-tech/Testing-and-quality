/**
 * app.js
 * ----------
 * This file creates and configures the Express application.
 * We export `app` so:
 * 1) tests can import it without starting a real network server
 * 2) server.js can import it and run it on a port
 */
const express = require("express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

// Create one Express application instance.
const app = express();

// Middleware: parse JSON bodies from incoming requests (POST/PUT/PATCH).
// Example: { "name": "Alice", "email": "alice@example.com" }
app.use(express.json());

// Serve frontend static files from /public.
app.use(express.static(path.join(__dirname, "public")));

// Route mounting:
// Any route defined in userRoutes will be prefixed with /users.
// Example: router.post("/") becomes POST /users
app.use("/users", userRoutes);

// Export app instance for server startup and integration testing.
module.exports = app;
