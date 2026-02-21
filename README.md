# User Management API (Node.js + Express)

Beginner-friendly User Management API project with MVC structure, in-memory storage, and complete test setup using Jest + Supertest.

## Features

- Node.js + Express REST API
- In-memory user storage (no database)
- MVC-style folder separation
- Email validation utility (regex based)
- Unit tests (Jest)
- Integration tests (Supertest)
- Coverage reports enabled

## Project Structure

```text
.
|-- app.js
|-- server.js
|-- package.json
|-- controllers/
|   `-- userController.js
|-- routes/
|   `-- userRoutes.js
|-- utils/
|   `-- validateEmail.js
`-- tests/
    |-- userRoutes.test.js
    `-- validateEmail.test.js
```

## Prerequisites

- Node.js (v18+ recommended)
- npm

## Installation

```bash
npm install
```

## Run the Server

```bash
npm start
```

Server runs on:

- `http://localhost:3000` (default)
- or custom port via `PORT` environment variable

## API Endpoints

Base URL: `http://localhost:3000`

### 1) Create User

- Method: `POST`
- Path: `/users`
- Success status: `201 Created`
- Error status: `400 Bad Request`

Request body:

```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```

Success response:

```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com"
}
```

Validation error response:

```json
{
  "message": "Name is required."
}
```

or

```json
{
  "message": "A valid email is required."
}
```

### 2) Get All Users

- Method: `GET`
- Path: `/users`
- Success status: `200 OK`

Success response:

```json
[
  {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
  }
]
```

### 3) Get User By ID

- Method: `GET`
- Path: `/users/:id`
- Success status: `200 OK`
- Error status: `404 Not Found`

Not found response:

```json
{
  "message": "User not found."
}
```

### 4) Delete User By ID

- Method: `DELETE`
- Path: `/users/:id`
- Success status: `204 No Content`
- Error status: `404 Not Found`

Not found response:

```json
{
  "message": "User not found."
}
```

## Business Rules

- `name` must not be empty
- `email` must be valid (regex check)
- Correct status codes are returned:
  - `201` for create success
  - `400` for invalid input
  - `404` when user not found
  - `204` for successful delete

## Testing

Run tests:

```bash
npm test
```

Current test coverage includes:

- Unit tests for `validateEmail`
- Invalid email cases
- Integration tests for:
  - `POST /users` success
  - `POST /users` invalid data
  - `GET /users`
  - `GET /users/:id`
  - `DELETE /users/:id`

Coverage output is generated in the `coverage/` folder.

## Example cURL Commands

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

Get user by id:

```bash
curl http://localhost:3000/users/1
```

Delete user:

```bash
curl -X DELETE http://localhost:3000/users/1
```
