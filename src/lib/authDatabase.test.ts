import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createUser, findUserByEmail, type AuthQuery } from './authDatabase';

describe('authDatabase', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes email before looking up a user', async () => {
    const calls: string[] = [];
    const query = ((strings: TemplateStringsArray, ...values: unknown[]) => {
      calls.push(`${strings.join('?')} ${values.join('|')}`);
      return Promise.resolve(calls.length === 1 ? [] : [{ id: '1', name: 'Alex', email: 'alex@example.com', password_hash: 'hash', created_at: 'today' }]);
    }) as AuthQuery;

    const user = await findUserByEmail(' Alex@EXAMPLE.com ', query);

    expect(user?.email).toBe('alex@example.com');
    expect(calls[1]).toContain('alex@example.com');
  });

  it('creates a user with a password hash and normalized email', async () => {
    const query = vi.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]) as unknown as AuthQuery;

    const user = await createUser(' Alex ', ' ALEX@EXAMPLE.COM ', 'bcrypt-hash', query);

    expect(user.name).toBe('Alex');
    expect(user.email).toBe('alex@example.com');
    expect(user.password).toBe('bcrypt-hash');
    expect(query).toHaveBeenCalledTimes(2);
  });
});