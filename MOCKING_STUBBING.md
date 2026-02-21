# Mocking & Stubbing Guide (Jest + Node.js)

This document explains mocking and stubbing in the context of the current User Management API project.

## 1) Basic Definitions

- `Mocking`: Replacing a real dependency with a fake function/object and asserting how it was called.
- `Stubbing`: Forcing a function to return a fixed value so test behavior stays predictable.

## 2) Mock vs Stub (Quick Difference)

- Mock:
  - Focus: interaction verification
  - Example: `expect(mockFn).toHaveBeenCalledWith(...)`
- Stub:
  - Focus: controlled output
  - Example: making `validateEmail` always return `true`

Note: In Jest, the same APIs (`jest.fn`, `jest.spyOn`) are often used for both mocking and stubbing.

## 3) Where to Use This in This Project

- Controller unit tests:
  - Stub `validateEmail` to control validation behavior.
  - Mock Express `req`/`res` to verify status and response calls.
- Integration tests with Supertest:
  - Usually no mocking, because the goal is to test real route flow.
  - Mocking is more useful when external services exist (database, email service, payment API).

## 4) Common Jest Tools

- `jest.fn()`: creates a manual mock function
- `mockReturnValue(value)`: sets a fixed return value (stubbing)
- `mockImplementation(fn)`: sets custom behavior
- `jest.spyOn(obj, "method")`: observes or replaces an existing method
- `mockRestore()`: restores original implementation
- `jest.mock("modulePath")`: mocks an entire module

## 5) Example 1: Simple Stub

```js
const stub = jest.fn().mockReturnValue(true);
expect(stub("anything")).toBe(true);
```

This stub always returns `true`.

## 6) Example 2: Mock with Interaction Verification

```js
const saveUser = jest.fn();

saveUser({ name: "Alice" });

expect(saveUser).toHaveBeenCalledTimes(1);
expect(saveUser).toHaveBeenCalledWith({ name: "Alice" });
```

This verifies that the mock function was called correctly.

## 7) Project Example: Controller Unit Test with Stubbing

If you want to isolate `createUser` and skip real regex validation, stub `validateEmail`:

```js
jest.mock("../utils/validateEmail", () => jest.fn());

const validateEmail = require("../utils/validateEmail");
const { createUser, __resetUsers } = require("../controllers/userController");

describe("createUser controller (unit)", () => {
  beforeEach(() => {
    __resetUsers();
    jest.clearAllMocks();
  });

  test("returns 201 when validateEmail stub returns true", () => {
    validateEmail.mockReturnValue(true);

    const req = { body: { name: "Alice", email: "not-checked@example.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    createUser(req, res);

    expect(validateEmail).toHaveBeenCalledWith("not-checked@example.com");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });
});
```

## 8) Project Example: Mocking Express `res`

For controller unit tests, this `res` mock is common:

```js
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
};
```

Why this works:

- `mockReturnThis()` allows chaining like `res.status(...).json(...)`.

## 9) When to Avoid Mocking/Stubbing

- When you need true route-level behavior (integration tests)
- When the dependency is simple and real behavior should be tested (for example, `validateEmail` unit tests)

## 10) Best Practices

- Keep test intent clear: do not mix unit and integration goals in one test.
- Avoid excessive mocking, because it can reduce real confidence.
- Reset mocks in `beforeEach` with `jest.clearAllMocks()`.
- Clean up spies/mocks that modify real modules.
- Use behavior-focused test names, such as `returns 400 when email is invalid`.

## 11) Suggested Additional Test File (Optional)

You can add:

- `tests/userController.unit.test.js`

In this file:

- Stub `validateEmail`
- Mock `req` and `res`
- Unit test `createUser`, `getUserById`, and `deleteUser`

## 12) Quick Summary

- Stub = fixed output
- Mock = call verification plus optional fake behavior
- For this project:
  - Supertest integration tests are already strong
  - Next improvement is dedicated controller unit tests with mocks/stubs
