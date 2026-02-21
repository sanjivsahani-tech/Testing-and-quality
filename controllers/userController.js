/**
 * controllers/userController.js
 * -----------------------------
 * Controller layer for user endpoints.
 * Supports both in-memory and MongoDB persistence through repository abstraction.
 */
const validateEmail = require("../utils/validateEmail");
const userRepository = require("../repositories/userRepository");

async function createUser(req, res) {
  try {
    const { name, email } = req.body || {};

    if (!name || String(name).trim() === "") {
      return res.status(400).json({ message: "Name is required." });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "A valid email is required." });
    }

    const createdUser = await userRepository.createUser({
      name: String(name).trim(),
      email: String(email).trim()
    });

    return res.status(201).json(createdUser);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function getUsers(req, res) {
  try {
    const users = await userRepository.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function getUserById(req, res) {
  try {
    const user = await userRepository.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function deleteUser(req, res) {
  try {
    const wasDeleted = await userRepository.deleteUserById(req.params.id);
    if (!wasDeleted) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function __resetUsers() {
  await userRepository.resetUsers();
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  __resetUsers
};
