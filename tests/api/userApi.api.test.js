const request = require("supertest");
const app = require("../../app");
const { resetUserState } = require("../helpers/testState");
const { validUser } = require("../helpers/userFixtures");

describe("API | user contract", () => {
  beforeEach(async () => {
    await resetUserState();
  });

  describe("POST /users", () => {
    test("returns 201 with created user shape", async () => {
      const response = await request(app).post("/users").send(validUser({ name: "Charlie", email: "charlie@example.com" }));

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: "Charlie",
        email: "charlie@example.com"
      });
    });

    test("returns 400 for invalid email", async () => {
      const response = await request(app).post("/users").send(validUser({ name: "Charlie", email: "bad-email" }));

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ message: "A valid email is required." });
    });
  });

  describe("GET /users/:id", () => {
    test("returns 200 with expected user", async () => {
      await request(app).post("/users").send(validUser({ name: "Daisy", email: "daisy@example.com" }));

      const response = await request(app).get("/users/1");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: "Daisy",
        email: "daisy@example.com"
      });
    });
  });

  describe("DELETE /users/:id", () => {
    test("returns 204 and empty body", async () => {
      await request(app).post("/users").send(validUser({ name: "Evan", email: "evan@example.com" }));

      const response = await request(app).delete("/users/1");
      expect(response.statusCode).toBe(204);
      expect(response.text).toBe("");
    });
  });
});
