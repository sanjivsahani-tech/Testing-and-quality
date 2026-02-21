const request = require("supertest");
const app = require("../../app");
const { resetUserState } = require("../helpers/testState");
const { validUser } = require("../helpers/userFixtures");
const { startMongoMemoryServer, stopMongoMemoryServer } = require("../helpers/mongoMemory");

let mongoServer;

describe("Database | MongoDB persistence", () => {
  beforeAll(async () => {
    mongoServer = await startMongoMemoryServer();
  });

  beforeEach(async () => {
    await resetUserState();
  });

  afterAll(async () => {
    await stopMongoMemoryServer(mongoServer);
  });

  describe("create and read", () => {
    test("creates and reads a user from MongoDB", async () => {
      const createResponse = await request(app).post("/users").send(
        validUser({ name: "Mongo User", email: "mongo@example.com" })
      );

      expect(createResponse.statusCode).toBe(201);
      expect(createResponse.body.id).toMatch(/^[a-f0-9]{24}$/);

      const getResponse = await request(app).get(`/users/${createResponse.body.id}`);
      expect(getResponse.statusCode).toBe(200);
      expect(getResponse.body).toEqual({
        id: createResponse.body.id,
        name: "Mongo User",
        email: "mongo@example.com"
      });
    });
  });

  describe("delete", () => {
    test("deletes a user from MongoDB", async () => {
      const createResponse = await request(app).post("/users").send(
        validUser({ name: "Delete Me", email: "delete@example.com" })
      );

      const deleteResponse = await request(app).delete(`/users/${createResponse.body.id}`);
      expect(deleteResponse.statusCode).toBe(204);

      const getResponse = await request(app).get(`/users/${createResponse.body.id}`);
      expect(getResponse.statusCode).toBe(404);
    });
  });
});
