jest.mock("../../utils/validateEmail", () => jest.fn());

const validateEmail = require("../../utils/validateEmail");
const userController = require("../../controllers/userController");
const { createMockReq, createMockRes } = require("../helpers/mockExpress");
const { validUser } = require("../helpers/userFixtures");
const { resetUserState } = require("../helpers/testState");

describe("Unit | userController", () => {
  beforeEach(async () => {
    await resetUserState();
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    test("returns 400 when name is empty", async () => {
      const req = createMockReq({ body: { name: " ", email: "alice@example.com" } });
      const res = createMockRes();

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Name is required." });
    });

    test("returns 400 when email is invalid", async () => {
      validateEmail.mockReturnValue(false);
      const req = createMockReq({ body: validUser({ email: "not-valid" }) });
      const res = createMockRes();

      await userController.createUser(req, res);

      expect(validateEmail).toHaveBeenCalledWith("not-valid");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "A valid email is required." });
    });

    test("returns 201 and saves trimmed values for valid input", async () => {
      validateEmail.mockReturnValue(true);
      const req = createMockReq({
        body: validUser({ name: " Alice ", email: " alice@example.com " })
      });
      const res = createMockRes();

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: "Alice",
        email: "alice@example.com"
      });
    });
  });

  describe("getUserById", () => {
    test("returns 404 when user does not exist", async () => {
      const req = createMockReq({ params: { id: "999" } });
      const res = createMockRes();

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found." });
    });

    test("returns 200 and user when user exists", async () => {
      validateEmail.mockReturnValue(true);
      await userController.createUser(createMockReq({ body: validUser() }), createMockRes());

      const req = createMockReq({ params: { id: "1" } });
      const res = createMockRes();
      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: "Alice",
        email: "alice@example.com"
      });
    });
  });

  describe("deleteUser", () => {
    test("returns 404 when user does not exist", async () => {
      const req = createMockReq({ params: { id: "5" } });
      const res = createMockRes();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found." });
    });

    test("returns 204 and removes user when user exists", async () => {
      validateEmail.mockReturnValue(true);
      await userController.createUser(createMockReq({ body: validUser() }), createMockRes());

      const req = createMockReq({ params: { id: "1" } });
      const res = createMockRes();
      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
