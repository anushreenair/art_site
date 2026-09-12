import { neon } from '@neondatabase/serverless';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  created: string;
};

export type AuthQuery = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Record<string, unknown>[]>;

let initialized = new WeakSet<object>();

export function getAuthDatabase(): AuthQuery {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured.');
  return neon(url) as unknown as AuthQuery;
}

export async function findUserByEmail(email: string, query: AuthQuery = getAuthDatabase()): Promise<AuthUser | null> {
  await initializeUsersTable(query);
  const rows = await query`SELECT id, name, email, password_hash, created_at FROM users WHERE email = ${normalizeEmail(email)} LIMIT 1`;
  const row = rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    password: String(row.password_hash),
    created: String(row.created_at),
  };
}

export async function createUser(name: string, email: string, password: string, query: AuthQuery = getAuthDatabase()): Promise<AuthUser> {
  await initializeUsersTable(query);
  const user: AuthUser = {
    id: globalThis.crypto.randomUUID(),
    name: name.trim(),
    email: normalizeEmail(email),
    password,
    created: new Date().toISOString(),
  };
  await query`INSERT INTO users (id, name, email, password_hash, created_at) VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password}, ${user.created})`;
  return user;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function initializeUsersTable(query: AuthQuery): Promise<void> {
  if (initialized.has(query)) return;
  await query`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  initialized.add(query);
}