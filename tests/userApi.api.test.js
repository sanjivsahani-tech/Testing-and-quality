/**
 * API tests focused on endpoint contracts (status codes + response shape).
 */
const request = require("supertest");
const app = require("../app");
const userController = require("../controllers/userController");

describe("User API contract tests", () => {
  beforeEach(async () => {
    await userController.__resetUsers();
  });

  test("POST /users returns 201 with created user shape", async () => {
    const response = await request(app).post("/users").send({
      name: "Charlie",
      email: "charlie@example.com"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: "Charlie",
      email: "charlie@example.com"
    });
  });

  test("POST /users returns 400 for invalid email", async () => {
    const response = await request(app).post("/users").send({
      name: "Charlie",
      email: "bad-email"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "A valid email is required." });
  });

  test("GET /users/:id returns 200 with expected user", async () => {
    await request(app).post("/users").send({
      name: "Daisy",
      email: "daisy@example.com"
    });

    const response = await request(app).get("/users/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "Daisy",
      email: "daisy@example.com"
    });
  });

  test("DELETE /users/:id returns 204 and empty body", async () => {
    await request(app).post("/users").send({
      name: "Evan",
      email: "evan@example.com"
    });

    const response = await request(app).delete("/users/1");
    expect(response.statusCode).toBe(204);
    expect(response.text).toBe("");
  });
});
