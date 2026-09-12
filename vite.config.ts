import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { compare, hash } from 'bcryptjs';
import { createUser, findUserByEmail, normalizeEmail } from './src/lib/authDatabase.ts';
import { POST as searchPost } from './api/search.ts';
import { GET as imageSearchGet } from './api/image-search.ts';

type DevRequest = { method?: string; url?: string; setEncoding: (encoding: string) => void; on: (event: 'data' | 'end', listener: (chunk?: string) => void) => void };
type DevResponse = { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void };

type DevUser = { id: string; name: string; email: string; password: string };

function devAuthPlugin(): Plugin {
  const users = new Map<string, DevUser>([
    ['artist@atelier.test', { id: 'local-artist', name: 'Alex Rivera', email: 'artist@atelier.test', password: 'password123' }],
  ]);

  return {
    name: 'atelier-dev-auth',
    configureServer(server) {
      const localEnv = loadEnv(server.config.mode, server.config.root, '');
      for (const key of ['QWEN_API_KEY', 'DASHSCOPE_API_KEY', 'QWEN_BASE_URL', 'QWEN_DASHSCOPE_URL', 'QWEN_MODEL']) {
        if (localEnv[key] && !process.env[key]) process.env[key] = localEnv[key];
      }
      server.middlewares.use('/api/search', async (req, res) => {
        if (req.method !== 'POST') { sendJson(res, { error: 'Use POST.' }, 405); return; }
        let content = '';
        for await (const chunk of req) {
          content += chunk.toString();
          if (content.length > 16384) { sendJson(res, { error: 'Search request is too large.' }, 413); return; }
        }
        const response = await searchPost(new Request('http://localhost/api/search', { method: 'POST', body: content }));
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(await response.text());
      });
      server.middlewares.use('/api/image-search', async (req, res, next) => {
        const request = req as unknown as DevRequest;
        if (request.method !== 'GET') { next(); return; }
        const response = await imageSearchGet(new Request(`http://localhost${request.url ?? '/api/image-search'}`));
        res.statusCode = response.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(await response.text());
      });
      server.middlewares.use('/api/signin', async (req, res, next) => {
        const request = req as unknown as DevRequest;
        if (request.method !== 'POST') { next(); return; }
        const body = await readJson(request);
        const email = String(body.email ?? '').trim().toLowerCase();
        if (process.env.DATABASE_URL) {
          try {
            const user = await findUserByEmail(email);
            if (!user || !await compare(String(body.password ?? ''), user.password)) {
              sendJson(res, { ok: false, error: 'No matching account.' }, 401);
              return;
            }
            if (!body.otp) {
              sendJson(res, { ok: true, otpRequired: true, userId: user.id, name: user.name });
              return;
            }
            sendJson(res, body.otp === '123456' ? { ok: true, userId: user.id, name: user.name } : { ok: false, error: 'Invalid passcode.' }, body.otp === '123456' ? 200 : 401);
          } catch {
            sendJson(res, { ok: false, error: 'Sign in is unavailable right now.' }, 500);
          }
          return;
        }
        const user = users.get(email);
        if (!user || body.password !== user.password) {
          sendJson(res, { ok: false, error: 'No matching local account. Use artist@atelier.test / password123.' }, 401);
          return;
        }
        if (!body.otp) {
          sendJson(res, { ok: true, otpRequired: true, userId: user.id, name: user.name });
          return;
        }
        sendJson(res, body.otp === '123456' ? { ok: true, userId: user.id, name: user.name } : { ok: false, error: 'Invalid passcode.' }, body.otp === '123456' ? 200 : 401);
      });

      server.middlewares.use('/api/signup', async (req, res, next) => {
        const request = req as unknown as DevRequest;
        if (request.method !== 'POST') { next(); return; }
        const body = await readJson(request);
        const name = String(body.name ?? '').trim();
        const email = String(body.email ?? '').trim().toLowerCase();
        const password = String(body.password ?? '');
        if (!name || !email || password.length < 8) {
          sendJson(res, { ok: false, error: 'Add your name, email, and a password with at least 8 characters.' }, 400);
          return;
        }
        if (process.env.DATABASE_URL) {
          try {
            if (await findUserByEmail(email)) {
              sendJson(res, { ok: false, error: 'An account with this email already exists.' }, 409);
              return;
            }
            const user = await createUser(name, normalizeEmail(email), await hash(password, 12));
            sendJson(res, { ok: true, userId: user.id, name: user.name });
          } catch {
            sendJson(res, { ok: false, error: 'Could not create account right now.' }, 500);
          }
          return;
        }
        if (users.has(email)) {
          sendJson(res, { ok: false, error: 'An account with this email already exists.' }, 409);
          return;
        }
        const user = { id: `local-${users.size + 1}`, name, email, password };
        users.set(email, user);
        sendJson(res, { ok: true, userId: user.id, name: user.name });
      });
    },
  };
}

function readJson(req: DevRequest): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let content = '';
    req.setEncoding('utf8');
    req.on('data', (chunk: string = '') => { content += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(content) as Record<string, unknown>); } catch { resolve({}); }
    });
  });
}

function sendJson(res: DevResponse, data: unknown, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default defineConfig({
  plugins: [react(), devAuthPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
