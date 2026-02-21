/**
 * Database integration tests using in-memory MongoDB.
 * This validates that the API works with real Mongo persistence.
 */
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const userController = require("../controllers/userController");
const { connectDB, disconnectDB } = require("../config/db");

let mongoServer;

describe("User MongoDB database tests", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.USE_MONGO = "true";
    process.env.MONGO_URI = mongoServer.getUri();
    await connectDB();
  });

  beforeEach(async () => {
    await userController.__resetUsers();
  });

  afterAll(async () => {
    await disconnectDB();
    if (mongoServer) {
      await mongoServer.stop();
    }
    delete process.env.USE_MONGO;
    delete process.env.MONGO_URI;
  });

  test("creates and reads a user from MongoDB", async () => {
    const createResponse = await request(app).post("/users").send({
      name: "Mongo User",
      email: "mongo@example.com"
    });

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

  test("deletes a user from MongoDB", async () => {
    const createResponse = await request(app).post("/users").send({
      name: "Delete Me",
      email: "delete@example.com"
    });

    const deleteResponse = await request(app).delete(`/users/${createResponse.body.id}`);
    expect(deleteResponse.statusCode).toBe(204);

    const getResponse = await request(app).get(`/users/${createResponse.body.id}`);
    expect(getResponse.statusCode).toBe(404);
  });
});
