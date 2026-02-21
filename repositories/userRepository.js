const mongoose = require("mongoose");
const User = require("../models/User");
const { connectDB, isMongoEnabled } = require("../config/db");

const inMemoryUsers = [];
let nextId = 1;

function mapMongoUser(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email
  };
}

async function createUser({ name, email }) {
  if (isMongoEnabled()) {
    await connectDB();
    const doc = await User.create({ name, email });
    return mapMongoUser(doc);
  }

  const user = { id: nextId++, name, email };
  inMemoryUsers.push(user);
  return user;
}

async function getAllUsers() {
  if (isMongoEnabled()) {
    await connectDB();
    const docs = await User.find({}).sort({ createdAt: 1 });
    return docs.map(mapMongoUser);
  }

  return [...inMemoryUsers];
}

async function getUserById(id) {
  if (isMongoEnabled()) {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await User.findById(id);
    return doc ? mapMongoUser(doc) : null;
  }

  const numericId = Number(id);
  return inMemoryUsers.find((user) => user.id === numericId) || null;
}

async function deleteUserById(id) {
  if (isMongoEnabled()) {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const deleted = await User.findByIdAndDelete(id);
    return Boolean(deleted);
  }

  const numericId = Number(id);
  const index = inMemoryUsers.findIndex((user) => user.id === numericId);
  if (index === -1) {
    return false;
  }

  inMemoryUsers.splice(index, 1);
  return true;
}

async function resetUsers() {
  if (isMongoEnabled()) {
    await connectDB();
    await User.deleteMany({});
    return;
  }

  inMemoryUsers.length = 0;
  nextId = 1;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  resetUsers
};
