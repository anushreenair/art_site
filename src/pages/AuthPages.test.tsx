import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignInPage } from './SignInPage';

describe('SignInPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('explains what details are needed before a preview sign-in', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignInPage /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Enter your email address.')).toBeVisible();
    expect(screen.getByText('Enter your password.')).toBeVisible();
  });

  it('shows a backend error without redirecting when sign-in fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'Incorrect password.' }), { status: 401, headers: { 'Content-Type': 'application/json' } })));
    const user = userEvent.setup();
    render(<MemoryRouter><SignInPage /></MemoryRouter>);
    await user.type(screen.getByLabelText('Email address'), 'artist@atelier.test');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText('Incorrect password.')).toBeVisible();
    vi.unstubAllGlobals();
  });
});
