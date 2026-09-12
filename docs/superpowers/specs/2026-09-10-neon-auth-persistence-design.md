# Neon Authentication Persistence

## Goal

Make sign-up and sign-in persist and retrieve user accounts from Neon while preserving the existing password, OTP, redirect, and landing-page welcome flow.

## Architecture

The Vercel API functions will share a small Neon database helper. The helper will use `DATABASE_URL`, create the `users` table if needed, and expose account lookup and creation operations. Passwords remain bcrypt hashes and are never returned to the browser.

When `DATABASE_URL` is configured, the Vite development middleware will use the same Neon-backed operations. When it is absent, the existing in-memory development account remains available so the frontend can still be exercised locally. Production deployments must configure `DATABASE_URL` and will not use the fallback.

## Data Model

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API Behavior

- `POST /api/signup` validates name, email, and an eight-character minimum password, hashes the password, inserts the user, and returns `{ ok, userId, name }`.
- Duplicate emails return HTTP 409.
- `POST /api/signin` looks up the normalized email and compares the bcrypt hash.
- A valid password returns `otpRequired: true` and the user identity.
- A valid OTP returns the user identity; an invalid OTP returns HTTP 401.
- Database failures return a generic HTTP 500 response without exposing connection details.

## Configuration and Documentation

Add `@neondatabase/serverless` as a runtime dependency. Document `DATABASE_URL` setup for local development and Vercel. Do not commit `.env.local` values or credentials.

## Testing

Keep existing UI tests, add database helper tests around normalization, duplicate users, and password storage behavior using a mocked SQL boundary, and run the full Vitest suite plus the production build.