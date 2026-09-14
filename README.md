# User Management API

A REST API for user CRUD operations built with Express and MySQL.

## Setup

1. Install Node.js 18 or newer and MySQL.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the database and table:

   ```bash
   mysql -u root -p < schema.sql
   ```

4. Copy `.env.example` to `.env` and set your MySQL credentials.
5. Start the API:

   ```bash
   npm run dev
   ```

The default URL is `http://localhost:3000`.

## Endpoints

- `GET /health` checks that the server is running.
- `GET /api/users` lists users.
- `GET /api/users/:id` returns one user.
- `POST /api/users` creates a user with `{ "name": "Ada Lovelace", "email": "ada@example.com" }`.
- `PATCH /api/users/:id` updates either `name` or `email`.
- `DELETE /api/users/:id` deletes a user.

All database values are passed through parameterized queries. Email addresses are unique.
