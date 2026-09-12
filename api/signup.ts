import { hash } from 'bcryptjs';
import { createUser, findUserByEmail, normalizeEmail } from '../src/lib/authDatabase';

type SignupBody = { name: string; email: string; password: string };

export async function POST(req: Request): Promise<Response> {
  const body: SignupBody = await req.json().catch(() => ({} as SignupBody));
  if (!body.name?.trim() || !body.email?.trim() || !body.password) {
    return json({ ok: false, error: 'Name, email, and password are required.' }, 400);
  }
  if (body.password.length < 8) {
    return json({ ok: false, error: 'Password must be at least 8 characters.' }, 400);
  }

  try {
    const email = normalizeEmail(body.email);
    if (await findUserByEmail(email)) {
      return json({ ok: false, error: 'An account with this email already exists.' }, 409);
    }
    const user = await createUser(body.name, email, await hash(body.password, 12));
    return json({ ok: true, userId: user.id, name: user.name });
  } catch (err: unknown) {
    if (isDuplicateEmailError(err)) {
      return json({ ok: false, error: 'An account with this email already exists.' }, 409);
    }
    return json({ ok: false, error: 'Could not create account right now.' }, 500);
  }
}

function isDuplicateEmailError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
