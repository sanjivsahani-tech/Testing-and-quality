# User Management API (Node.js + Express)

Beginner-friendly User Management REST API with MVC structure, testing dashboard, and both in-memory + MongoDB support.

## Features

- Express REST API
- In-memory mode (default)
- MongoDB mode with Mongoose (`USE_MONGO=true`)
- MVC + repository structure
- Unit, Integration, API, and Database tests
- Jest coverage + JSON test report generation
- Frontend test dashboard (auto-refresh)
- Postman collection included

## Project Structure

```text
.
|-- app.js
|-- server.js
|-- package.json
|-- config/
|   `-- db.js
|-- controllers/
|   `-- userController.js
|-- models/
|   `-- User.js
|-- repositories/
|   `-- userRepository.js
|-- routes/
|   `-- userRoutes.js
|-- utils/
|   `-- validateEmail.js
|-- public/
|   |-- index.html
|   |-- script.js
|   |-- styles.css
|   `-- test-report.json
|-- scripts/
|   `-- generateTestReport.js
|-- postman/
|   `-- User-Management-API.postman_collection.json
`-- tests/
    |-- setup/
    |   `-- jest.setup.js
    |-- helpers/
    |   |-- mockExpress.js
    |   |-- mongoMemory.js
    |   |-- testState.js
    |   `-- userFixtures.js
    |-- unit/
    |   |-- validateEmail.unit.test.js
    |   `-- userController.unit.test.js
    |-- integration/
    |   `-- userRoutes.integration.test.js
    |-- api/
    |   `-- userApi.api.test.js
    `-- database/
        `-- userDatabase.db.test.js
```

## Installation

```bash
npm install
```

## Run API

In-memory mode (default):

```bash
npm start
```

MongoDB mode:

```powershell
$env:USE_MONGO="true"
$env:MONGO_URI="mongodb://127.0.0.1:27017/test_case"
npm start
```

## API Endpoints

Base URL: `http://localhost:3000`

- `POST /users` -> Create user (`201`, `400`)
- `GET /users` -> Get all users (`200`)
- `GET /users/:id` -> Get user by ID (`200`, `404`)
- `DELETE /users/:id` -> Delete user by ID (`204`, `404`)

Business rules:

- `name` cannot be empty
- `email` must be valid

## Testing

Run all tests:

```bash
npm test
```

This command:

1. Runs Jest with coverage
2. Writes `coverage/jest-report.json`
3. Writes `coverage/coverage-summary.json`
4. Generates frontend report `public/test-report.json`

Test categories:

- Unit: utility + controller unit logic
- Integration: route behavior with app flow
- API: endpoint contract/status/shape tests
- Database: MongoDB persistence tests (`mongodb-memory-server`)

## Test Organization

- File structure:
  - `tests/unit` for isolated unit tests
  - `tests/integration` for route-level flow tests
  - `tests/api` for endpoint contract/status tests
  - `tests/database` for real Mongo persistence tests
- Suite organization:
  - Each file uses nested `describe` blocks by feature/endpoint
  - Tests are grouped by operation (`create`, `get`, `delete`, etc.)
- Setup/teardown:
  - Global Jest setup: `tests/setup/jest.setup.js`
  - Per-suite state reset via `beforeEach` using `resetUserState()`
  - Mongo lifecycle in DB tests:
    - `beforeAll` start in-memory Mongo
    - `afterAll` disconnect and stop server
- Test helpers:
  - `tests/helpers/mockExpress.js` for mocked `req`/`res`
  - `tests/helpers/userFixtures.js` for reusable payloads/fixtures
  - `tests/helpers/testState.js` for shared reset logic
  - `tests/helpers/mongoMemory.js` for Mongo test lifecycle

## Frontend Test Dashboard

Open: `http://localhost:3000`

The dashboard shows:

- Unit / Integration / API / Database counts
- pass/fail totals
- coverage percentages
- suite-wise test list
- green tick for passed tests
- test cases grouped in plain English

Notes:

- The report auto-refreshes every 5 seconds.
- You can also click **Refresh Report** manually.

## Postman Collection

Import file:

- `postman/User-Management-API.postman_collection.json`

Includes requests for:

- Create User
- Get All Users
- Get User By ID
- Delete User By ID

## cURL Examples

Create user:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\"}"
```

Get all users:

```bash
curl http://localhost:3000/users
```

Get user by ID:

```bash
curl http://localhost:3000/users/1
```

Delete user by ID:

```bash
curl -X DELETE http://localhost:3000/users/1
```
