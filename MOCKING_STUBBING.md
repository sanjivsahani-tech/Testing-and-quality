# Mocking & Stubbing Guide (Jest + Node.js)

This guide explains how mocking and stubbing are used in the current User Management API project.

## 1) Quick Definitions

- Mocking: replace a real dependency and verify interactions.
- Stubbing: force a dependency to return controlled values.

## 2) Mock vs Stub

- Mock is interaction-focused:
  - Example: `expect(fn).toHaveBeenCalledWith(...)`
- Stub is behavior-focused:
  - Example: `validateEmail.mockReturnValue(false)`

In Jest, both are typically done using `jest.fn()` or `jest.spyOn()`.

## 3) Where This Project Uses Them

- Unit tests (`tests/userController.unit.test.js`):
  - `validateEmail` is mocked.
  - Express `req` and `res` are mocked.
  - Controller behavior is validated without calling HTTP routes.
- Integration/API/Database tests:
  - Use real app flow with Supertest.
  - Avoid mocking core behavior so route behavior is truly tested.

## 4) Common Jest APIs

- `jest.mock("module")`
- `jest.fn()`
- `mockReturnValue(value)`
- `mockImplementation(fn)`
- `jest.spyOn(object, "method")`
- `jest.clearAllMocks()`
- `mockRestore()`

## 5) Project Example: Stubbing `validateEmail`

```js
jest.mock("../utils/validateEmail", () => jest.fn());

const validateEmail = require("../utils/validateEmail");
const userController = require("../controllers/userController");

test("createUser returns 400 for invalid email", async () => {
  validateEmail.mockReturnValue(false);

  const req = { body: { name: "Alice", email: "bad-email" } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
  };

  await userController.createUser(req, res);

  expect(validateEmail).toHaveBeenCalledWith("bad-email");
  expect(res.status).toHaveBeenCalledWith(400);
});
```

## 6) Mocking Express `res` Object

Use this shape in unit tests:

```js
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
};
```

`mockReturnThis()` is required to support chaining: `res.status(...).json(...)`.

## 7) Async Note for This Project

Controller methods are async (repository-based), so unit tests should use `await`:

```js
await userController.createUser(req, res);
```

Also reset data in async hooks:

```js
beforeEach(async () => {
  await userController.__resetUsers();
  jest.clearAllMocks();
});
```

## 8) When Not to Mock

Avoid mocking when your goal is real behavior verification:

- Integration tests (`tests/userRoutes.test.js`)
- API contract tests (`tests/userApi.api.test.js`)
- Database tests (`tests/userDatabase.db.test.js`)

## 9) Best Practices

- Keep unit tests isolated and fast.
- Keep integration/database tests realistic.
- Reset mocks and test state in `beforeEach`.
- Prefer explicit test names that describe behavior.
- Mock only the dependency you need to control.

## 10) Current Test Layers (Project)

- Unit:
  - `tests/validateEmail.test.js`
  - `tests/userController.unit.test.js`
- Integration:
  - `tests/userRoutes.test.js`
- API Contract:
  - `tests/userApi.api.test.js`
- Database:
  - `tests/userDatabase.db.test.js`

This layered structure gives both speed (unit) and confidence (integration/API/database).
