const request = require("supertest");
const app = require("../../app");
const { resetUserState } = require("../helpers/testState");
const { validUser } = require("../helpers/userFixtures");

describe("Integration | user routes", () => {
  beforeEach(async () => {
    await resetUserState();
  });

  describe("POST /users", () => {
    test("creates a user successfully", async () => {
      const response = await request(app).post("/users").send(validUser());

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        name: "Alice",
        email: "alice@example.com"
      });
    });

    test("returns 400 for invalid data", async () => {
      const response = await request(app).post("/users").send({
        name: "",
        email: "invalid-email"
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /users", () => {
    test("returns all users", async () => {
      await request(app).post("/users").send(validUser());
      await request(app).post("/users").send(validUser({ name: "Bob", email: "bob@example.com" }));

      const response = await request(app).get("/users");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@example.com" }
      ]);
    });
  });

  describe("GET /users/:id", () => {
    test("returns one user by ID", async () => {
      await request(app).post("/users").send(validUser());
      const response = await request(app).get("/users/1");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: "Alice",
        email: "alice@example.com"
      });
    });

    test("returns 404 when user is missing", async () => {
      const response = await request(app).get("/users/99");
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ message: "User not found." });
    });
  });

  describe("DELETE /users/:id", () => {
    test("deletes user successfully", async () => {
      await request(app).post("/users").send(validUser());

      const response = await request(app).delete("/users/1");
      expect(response.statusCode).toBe(204);

      const getDeleted = await request(app).get("/users/1");
      expect(getDeleted.statusCode).toBe(404);
    });

    test("returns 404 if user does not exist", async () => {
      const response = await request(app).delete("/users/999");
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ message: "User not found." });
    });
  });
});
