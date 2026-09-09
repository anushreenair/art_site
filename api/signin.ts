import { get } from '@vercel/blob';
import { compare } from 'bcryptjs';

type SigninBody = { email: string; password: string };
type UserRecord = { id: string; name: string; email: string; password: string; created: string };

export async function POST(req: Request): Promise<Response> {
  const body: SigninBody = await req.json().catch(() => ({} as SigninBody));
  if (!body.email?.trim() || !body.password) {
    return json({ ok: false, error: 'Email and password are required.' }, 400);
  }

  const user = await getUser(body.email.toLowerCase().trim());
  if (!user) {
    return json({ ok: false, error: 'No account found with that email.' }, 401);
  }

  const match = await compare(body.password, user.password);
  if (!match) {
    return json({ ok: false, error: 'Incorrect password.' }, 401);
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
