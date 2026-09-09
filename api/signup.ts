import { put, get } from '@vercel/blob';
import { hash, compare } from 'bcryptjs';

type SignupBody = { name: string; email: string; password: string };
type UserRecord = { id: string; name: string; email: string; password: string; created: string };

export async function POST(req: Request): Promise<Response> {
  const body: SignupBody = await req.json().catch(() => ({} as SignupBody));
  if (!body.name?.trim() || !body.email?.trim() || !body.password) {
    return json({ ok: false, error: 'Name, email, and password are required.' }, 400);
  }
  if (body.password.length < 8) {
    return json({ ok: false, error: 'Password must be at least 8 characters.' }, 400);
  }

  const email = body.email.toLowerCase().trim();
  const existing = await getUser(email);
  if (existing) {
    return json({ ok: false, error: 'An account with this email already exists.' }, 409);
  }

  const passwordHash = await hash(body.password, 12);
  const user: UserRecord = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    email,
    password: passwordHash,
    created: new Date().toISOString(),
  };

  try {
    await put(email, JSON.stringify(user), {
      access: 'private',
      contentType: 'application/json',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('already exists')) {
      return json({ ok: false, error: 'An account with this email already exists.' }, 409);
    }
    throw err;
  }

  return json({ ok: true, userId: user.id, name: user.name });
}

async function getUser(email: string): Promise<UserRecord | null> {
  try {
    const result = await get(email, { access: 'private' });
    if (!result || result.statusCode !== 200 || result.stream == null) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as UserRecord;
  } catch {
    return null;
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
