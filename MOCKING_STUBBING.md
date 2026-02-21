# Mocking & Stubbing Guide (Jest + Node.js)

Yeh document aapke current User Management API project ke liye banaya gaya hai, taaki aap testing me `mocking` aur `stubbing` ko practical tareeke se use kar sako.

## 1) Simple Meaning

- `Mocking`: Real dependency ko fake object/function se replace karna, aur check karna ki usse kaise call kiya gaya.
- `Stubbing`: Function ka fixed output dena (hardcoded behavior), taaki test deterministic ho.

## 2) Mock vs Stub (Quick Difference)

- Mock:
  - Focus: interaction verification
  - Example: `expect(mockFn).toHaveBeenCalledWith(...)`
- Stub:
  - Focus: controlled return value/behavior
  - Example: `validateEmail` ko forcefully `true` return karwana

Note: Jest me aksar same API (`jest.fn`, `jest.spyOn`) dono purpose ke liye use hota hai.

## 3) Is Project me Kahan Use Hoga?

- Unit testing controller:
  - `validateEmail` ko stub karke controller behavior test kar sakte ho.
  - `req`/`res` objects ko mock karke status/json checks kar sakte ho.
- Integration testing with Supertest:
  - Usually mocking kam hota hai, kyunki hum real route flow test karte hain.
  - External service hota (DB, email service, payment API) tab mock/stub useful hota.

## 4) Common Jest Tools

- `jest.fn()`: manual mock function banata hai
- `mockReturnValue(value)`: fixed return देता है (stub behavior)
- `mockImplementation(fn)`: custom logic देता है
- `jest.spyOn(obj, "method")`: existing method ko observe/mock karta hai
- `mockRestore()`: original method wapas laata hai
- `jest.mock("modulePath")`: poore module ko mock kar deta hai

## 5) Example 1: Simple Stub

```js
const stub = jest.fn().mockReturnValue(true);
expect(stub("anything")).toBe(true);
```

Isme `stub` hamesha `true` return karega.

## 6) Example 2: Mock + Interaction Check

```js
const saveUser = jest.fn();

saveUser({ name: "Alice" });

expect(saveUser).toHaveBeenCalledTimes(1);
expect(saveUser).toHaveBeenCalledWith({ name: "Alice" });
```

Yeh mock interaction verify karta hai.

## 7) Project-Specific Example: Controller Unit Test with Stubbing

Man lo aap `createUser` ko isolate test karna chahte ho aur `validateEmail` ka real regex run nahi karna.

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
    validateEmail.mockReturnValue(true); // stub behavior

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

## 8) Project-Specific Example: `res` Object Mocking

Controller tests me Express `res` object ko is tarah mock karte hain:

```js
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
};
```

Reason:
- `res.status(...).json(...)` chaining ko support karne ke liye `status` ka `mockReturnThis()` use hota hai.

## 9) Kab Mock/Stub Avoid Karna Chahiye?

- Jab aap true end-to-end route behavior test karna chahte ho (integration level)
- Jab dependency lightweight ho aur real behavior test ka part ho (jaise current `validateEmail` utility unit test me)

## 10) Best Practices

- Har test ka clear intent rakho: unit vs integration mix mat karo.
- Over-mocking avoid karo, warna confidence fake ho sakta hai.
- `beforeEach` me mocks reset karo:
  - `jest.clearAllMocks()`
- Side effects wale modules ke liye proper cleanup karo.
- Test names behavior-driven rakho:
  - `returns 400 when email is invalid`

## 11) Suggested New Test Files (Optional)

Agar aap Mocking/Stubbing practice karna chahte ho, add kar sakte ho:

- `tests/userController.unit.test.js`

Is file me:
- `validateEmail` ko stub karo
- `req/res` mocks use karo
- `createUser`, `getUserById`, `deleteUser` ko unit level pe test karo

## 12) Quick Summary

- `Stub` = controlled return value
- `Mock` = interaction verify + optional fake behavior
- Current project me:
  - Integration tests already achhe hain (Supertest)
  - Next step: controller unit tests with mocks/stubs
