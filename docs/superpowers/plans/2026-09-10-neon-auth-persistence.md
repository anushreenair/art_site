# Neon Authentication Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist new user accounts in Neon and use them for password and OTP sign-in.

**Architecture:** Add a shared `src/lib/authDatabase.ts` Neon boundary used by the Vercel auth functions. The Vite dev middleware will use the same boundary when `DATABASE_URL` exists and retain its in-memory fallback otherwise. Passwords are bcrypt hashes and the browser receives only safe identity fields.

**Tech Stack:** React, Vite, Vercel functions, Neon serverless driver, bcryptjs, Vitest.

## Global Constraints

- Read the database URL only from `DATABASE_URL`.
- Never commit credentials or password values.
- Preserve the existing OTP contract and landing-page welcome behavior.
- Keep the no-database local fallback for frontend development.

---

### Task 1: Add Neon database boundary

**Files:**
- Create: `src/lib/authDatabase.ts`
- Modify: `package.json`, `package-lock.json`
- Test: `src/lib/authDatabase.test.ts`

- [ ] Install `@neondatabase/serverless`.
- [ ] Add tests for normalized email lookup, user creation payload, and missing `DATABASE_URL` behavior using a mocked SQL boundary.
- [ ] Implement `getAuthDatabase`, `findUserByEmail`, and `createUser` with table initialization and bcrypt-compatible password fields.
- [ ] Run the focused database tests.

### Task 2: Migrate API handlers

**Files:**
- Modify: `api/signup.ts`
- Modify: `api/signin.ts`

- [ ] Replace Vercel Blob reads and writes with the shared Neon boundary.
- [ ] Preserve validation, duplicate-email 409, password comparison, OTP validation, and safe response fields.
- [ ] Return generic 500 responses for database failures.
- [ ] Run the focused auth tests and typecheck.

### Task 3: Connect Vite local middleware

**Files:**
- Modify: `vite.config.ts`

- [ ] Use Neon account operations when `DATABASE_URL` is present.
- [ ] Keep the current in-memory account fallback when it is absent.
- [ ] Preserve local sign-up and OTP behavior.
- [ ] Run the production build and a local browser smoke test.

### Task 4: Document setup and verify

**Files:**
- Create: `db/schema.sql`
- Modify: `README.md`, `.env.example`

- [ ] Add the `users` table schema.
- [ ] Document Neon project setup, `DATABASE_URL`, local credentials-free configuration, and Vercel environment setup.
- [ ] Run the full test suite, build, and diff checks.