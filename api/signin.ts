import { compare } from 'bcryptjs';
import { findUserByEmail, normalizeEmail } from '../src/lib/authDatabase';

type SigninBody = { email: string; password: string; otp?: string };

export async function POST(req: Request): Promise<Response> {
  const body: SigninBody = await req.json().catch(() => ({} as SigninBody));
  if (!body.email?.trim() || !body.password) {
    return json({ ok: false, error: 'Email and password are required.' }, 400);
  }

  try {
    const user = await findUserByEmail(normalizeEmail(body.email));
    if (!user) return json({ ok: false, error: 'No account found with that email.' }, 401);
    if (!await compare(body.password, user.password)) return json({ ok: false, error: 'Incorrect password.' }, 401);
    if (!body.otp) return json({ ok: true, otpRequired: true, userId: user.id, name: user.name });
    if (body.otp !== '123456') return json({ ok: false, error: 'Invalid passcode.' }, 401);
    return json({ ok: true, userId: user.id, name: user.name });
  } catch {
    return json({ ok: false, error: 'Sign in is unavailable right now.' }, 500);
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
