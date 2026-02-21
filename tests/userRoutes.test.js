/**
 * tests/userRoutes.test.js
 * ------------------------
 * Integration tests for user API endpoints using Supertest.
 * These tests call real routes on the Express app instance
 * and validate status codes + response bodies.
 */
const request = require("supertest");
const app = require("../app");
const userController = require("../controllers/userController");

describe("User API integration tests", () => {
  // Reset shared in-memory data before each test for isolation.
  beforeEach(async () => {
    await userController.__resetUsers();
  });

  // Happy path: creating a valid user should return 201 + created object.
  test("POST /users creates a user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Alice",
      email: "alice@example.com"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      name: "Alice",
      email: "alice@example.com"
    });
  });

  // Negative path: invalid name/email should return 400.
  test("POST /users returns 400 for invalid data", async () => {
    const response = await request(app).post("/users").send({
      name: "",
      email: "invalid-email"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  // After creating users, GET /users should return full list in insertion order.
  test("GET /users returns all users", async () => {
    await request(app).post("/users").send({
      name: "Alice",
      email: "alice@example.com"
    });

    await request(app).post("/users").send({
      name: "Bob",
      email: "bob@example.com"
    });

    const response = await request(app).get("/users");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: "Alice", email: "alice@example.com" },
      { id: 2, name: "Bob", email: "bob@example.com" }
    ]);
  });

  // GET by existing id should return exactly one user.
  test("GET /users/:id returns one user by ID", async () => {
    await request(app).post("/users").send({
      name: "Alice",
      email: "alice@example.com"
    });

    const response = await request(app).get("/users/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "Alice",
      email: "alice@example.com"
    });
  });

  // GET by unknown id should return 404.
  test("GET /users/:id returns 404 when user is missing", async () => {
    const response = await request(app).get("/users/99");
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "User not found." });
  });

  // Deleting existing user should return 204, then user should no longer exist.
  test("DELETE /users/:id deletes user successfully", async () => {
    await request(app).post("/users").send({
      name: "Alice",
      email: "alice@example.com"
    });

    const response = await request(app).delete("/users/1");
    expect(response.statusCode).toBe(204);

    const getDeleted = await request(app).get("/users/1");
    expect(getDeleted.statusCode).toBe(404);
  });

  // Deleting non-existing user should return 404.
  test("DELETE /users/:id returns 404 if user does not exist", async () => {
    const response = await request(app).delete("/users/999");
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "User not found." });
  });
});
