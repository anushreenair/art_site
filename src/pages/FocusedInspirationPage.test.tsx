import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('FocusedInspirationPage', () => {
  it('keeps the initial inspiration set small and lets the artist reveal five more', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/focused-inspiration']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /focused inspiration/i })).toBeVisible();
    expect(screen.getByText(/you've found enough inspiration/i)).toBeVisible();
    expect(screen.getByText('3 studies selected')).toBeVisible();

    await user.click(screen.getByRole('button', { name: /show me 5 more/i }));
    expect(screen.getByText('8 studies selected')).toBeVisible();
  });

  it('starts a focused reference in the practice workspace', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/focused-inspiration']}><App /></MemoryRouter>);

    await user.click(screen.getAllByRole('button', { name: /start practice/i })[0]);
    expect(screen.getByText('Practice workspace')).toBeVisible();
  });
});
