import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignInPage } from './SignInPage';
import { HomePage } from './HomePage';

describe('SignInPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    const values = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        clear: () => values.clear(),
      },
    });
    window.localStorage.clear();
  });

  it('explains what details are needed before a preview sign-in', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/sign-in']}><Routes><Route path="/sign-in" element={<SignInPage />} /><Route path="/" element={<HomePage />} /></Routes></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Enter your email address.')).toBeVisible();
    expect(screen.getByText('Enter your password.')).toBeVisible();
  });

  it('shows a backend error without redirecting when sign-in fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'Incorrect password.' }), { status: 401, headers: { 'Content-Type': 'application/json' } })));
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/sign-in']}><Routes><Route path="/sign-in" element={<SignInPage />} /><Route path="/" element={<HomePage />} /></Routes></MemoryRouter>);
    await user.type(screen.getByLabelText('Email address'), 'artist@atelier.test');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText('Incorrect password.')).toBeVisible();
    vi.unstubAllGlobals();
  });

  it('asks for an OTP and welcomes the authenticated artist', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, otpRequired: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, name: 'Alex Rivera' }), { status: 200 })));
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/sign-in']}><Routes><Route path="/sign-in" element={<SignInPage />} /><Route path="/" element={<HomePage />} /></Routes></MemoryRouter>);

    await user.type(screen.getByLabelText('Email address'), 'alex@atelier.test');
    await user.type(screen.getByLabelText('Password'), 'correct-password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByLabelText('One-time passcode')).toBeVisible();
    expect(screen.getByText(/check your email/i)).toBeVisible();

    await user.type(screen.getByLabelText('One-time passcode'), '123456');
    await user.click(screen.getByRole('button', { name: /verify/i }));

    expect(await screen.findByText('Welcome, Alex Rivera')).toBeVisible();
    expect(window.localStorage.getItem('atelier-auth-user')).toContain('Alex Rivera');
  });
});
