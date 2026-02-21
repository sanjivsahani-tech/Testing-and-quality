/**
 * routes/userRoutes.js
 * --------------------
 * Route layer for all user-related endpoints.
 * Keeps URL mapping separate from business logic (controller),
 * which is a key part of MVC structure.
 */
const express = require("express");
const userController = require("../controllers/userController");

// Create a mini-router to define endpoints for users only.
const router = express.Router();

// POST /users -> Create a new user
router.post("/", userController.createUser);
// GET /users -> Return all users
router.get("/", userController.getUsers);
// GET /users/:id -> Return one user by numeric id
router.get("/:id", userController.getUserById);
// DELETE /users/:id -> Remove one user by numeric id
router.delete("/:id", userController.deleteUser);

// Export router to be mounted in app.js
module.exports = router;
