/**
 * Unit tests for userController using mocked dependencies.
 */
jest.mock("../utils/validateEmail", () => jest.fn());

const validateEmail = require("../utils/validateEmail");
const userController = require("../controllers/userController");

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
  };
}

describe("userController unit tests", () => {
  beforeEach(async () => {
    await userController.__resetUsers();
    jest.clearAllMocks();
  });

  test("createUser returns 400 when name is empty", async () => {
    const req = { body: { name: " ", email: "alice@example.com" } };
    const res = createMockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Name is required." });
  });

  test("createUser returns 400 when email is invalid", async () => {
    validateEmail.mockReturnValue(false);
    const req = { body: { name: "Alice", email: "not-valid" } };
    const res = createMockRes();

    await userController.createUser(req, res);

    expect(validateEmail).toHaveBeenCalledWith("not-valid");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "A valid email is required." });
  });

  test("createUser returns 201 and saves trimmed values for valid input", async () => {
    validateEmail.mockReturnValue(true);
    const req = { body: { name: " Alice ", email: " alice@example.com " } };
    const res = createMockRes();

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      name: "Alice",
      email: "alice@example.com"
    });
  });

  test("getUserById returns 404 when user does not exist", async () => {
    const req = { params: { id: "999" } };
    const res = createMockRes();

    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found." });
  });

  test("getUserById returns 200 and user when user exists", async () => {
    validateEmail.mockReturnValue(true);
    const createReq = { body: { name: "Alice", email: "alice@example.com" } };
    const createRes = createMockRes();
    await userController.createUser(createReq, createRes);

    const req = { params: { id: "1" } };
    const res = createMockRes();
    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      name: "Alice",
      email: "alice@example.com"
    });
  });

  test("deleteUser returns 404 when user does not exist", async () => {
    const req = { params: { id: "5" } };
    const res = createMockRes();

    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found." });
  });

  test("deleteUser returns 204 and removes user when user exists", async () => {
    validateEmail.mockReturnValue(true);
    await userController.createUser(
      { body: { name: "Alice", email: "alice@example.com" } },
      createMockRes()
    );

    const req = { params: { id: "1" } };
    const res = createMockRes();
    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
