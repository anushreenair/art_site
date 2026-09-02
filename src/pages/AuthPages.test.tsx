import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { SignInPage } from './SignInPage';

describe('SignInPage', () => {
  it('explains what details are needed before a preview sign-in', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SignInPage /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Enter your email address.')).toBeVisible();
    expect(screen.getByText('Enter your password.')).toBeVisible();
  });
});
