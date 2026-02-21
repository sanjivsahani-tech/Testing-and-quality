/**
 * controllers/userController.js
 * -----------------------------
 * Controller layer: contains business logic for user endpoints.
 * Data is stored in memory for simplicity (no database).
 */
const validateEmail = require("../utils/validateEmail");

// In-memory storage for demo/testing purposes.
// Note: this resets whenever the server restarts.
const users = [];

// Auto-incrementing id counter for newly created users.
let nextId = 1;

/**
 * POST /users
 * Create a user after validating name and email.
 *
 * Success: 201 + created user object
 * Validation error: 400 + message
 */
function createUser(req, res) {
  // Read values from request body. Fallback to empty object if body is missing.
  const { name, email } = req.body || {};

  // Business rule: name must not be empty.
  if (!name || String(name).trim() === "") {
    return res.status(400).json({ message: "Name is required." });
  }

  // Business rule: email must be valid.
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "A valid email is required." });
  }

  // Build the new user object.
  // We trim whitespace to keep data clean and consistent.
  const user = {
    id: nextId++,
    name: String(name).trim(),
    email: String(email).trim()
  };

  // Save user in memory and return it.
  users.push(user);
  return res.status(201).json(user);
}

/**
 * GET /users
 * Return all users currently in memory.
 *
 * Success: 200 + array of users
 */
function getUsers(req, res) {
  return res.status(200).json(users);
}

/**
 * GET /users/:id
 * Return one user by id.
 *
 * Success: 200 + user object
 * Not found: 404 + message
 */
function getUserById(req, res) {
  // Convert path param to number so it can match numeric ids in storage.
  const id = Number(req.params.id);
  const user = users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json(user);
}

/**
 * DELETE /users/:id
 * Delete one user by id.
 *
 * Success: 204 (no content)
 * Not found: 404 + message
 */
function deleteUser(req, res) {
  const id = Number(req.params.id);

  // Find the index so we can remove the matching item with splice.
  const index = users.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found." });
  }

  // Remove exactly one element at matched index.
  users.splice(index, 1);

  // 204 means operation succeeded and response body is intentionally empty.
  return res.status(204).send();
}

// Test helper to reset in-memory state between test cases.
function __resetUsers() {
  users.length = 0;
  nextId = 1;
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  __resetUsers
};
