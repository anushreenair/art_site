import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('I’m Stuck assistant', () => {
  it('offers a small, actionable plan and a 15-minute fix', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/practice/ref-portrait']}><App /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /i’m stuck/i }));
    expect(screen.getByRole('heading', { name: /what is happening/i })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Proportions Are Wrong' }));
    expect(screen.getByText('Don’t restart.')).toBeVisible();
    expect(screen.getByText(/shadow under the jaw/i)).toBeVisible();
    expect(screen.getByText(/work only on values for 15 minutes/i)).toBeVisible();

    await user.click(screen.getByRole('button', { name: /start 15-minute fix/i }));
    expect(screen.getByRole('button', { name: /pause 15-minute fix/i })).toBeVisible();
  });

  it('accepts a current-work upload for context', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/practice/ref-portrait']}><App /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /i’m stuck/i }));
    const upload = screen.getByLabelText(/upload your current work/i);
    await user.upload(upload, new File(['study'], 'portrait-progress.png', { type: 'image/png' }));
    expect(screen.getByText('portrait-progress.png ready to consider.')).toBeVisible();
  });
});
