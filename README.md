# User Management API (Node.js + Express)

This is a beginner-friendly User Management REST API built with Node.js and Express. It uses MVC structure, in-memory data storage, and a complete Jest + Supertest testing setup.

## Features

- Express-based REST API
- In-memory storage (no database)
- Clean MVC folder structure
- Email validation with regex
- Unit testing with Jest
- Integration testing with Supertest
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

- Node.js (v18 or later recommended)
- npm

## Installation

```bash
npm install
```

## Run the Application

```bash
npm start
```

The server runs at:

- `http://localhost:3000` by default
- A custom port if `PORT` is provided

## API Endpoints

Base URL: `http://localhost:3000`

### POST `/users`

Creates a new user.

- Success: `201 Created`
- Validation error: `400 Bad Request`

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

### GET `/users`

Returns all users.

- Success: `200 OK`

Response example:

```json
[
  {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
  }
]
```

### GET `/users/:id`

Returns a single user by ID.

- Success: `200 OK`
- Not found: `404 Not Found`

Not found response:

```json
{
  "message": "User not found."
}
```

### DELETE `/users/:id`

Deletes a user by ID.

- Success: `204 No Content`
- Not found: `404 Not Found`

Not found response:

```json
{
  "message": "User not found."
}
```

## Business Rules

- `name` must not be empty
- `email` must match a valid email format
- HTTP status codes:
  - `201` for successful creation
  - `400` for invalid input
  - `404` when user is not found
  - `204` for successful deletion

## Testing

Run tests:

```bash
npm test
```

Included coverage:

- Unit tests for `validateEmail`
- Invalid email scenarios
- Integration tests for:
  - `POST /users` success
  - `POST /users` invalid payload
  - `GET /users`
  - `GET /users/:id`
  - `DELETE /users/:id`

Coverage reports are generated in the `coverage/` folder.

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

Get one user:

```bash
curl http://localhost:3000/users/1
```

Delete one user:

```bash
curl -X DELETE http://localhost:3000/users/1
```
