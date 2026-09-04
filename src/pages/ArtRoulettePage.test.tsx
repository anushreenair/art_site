import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ArtRoulettePage', () => {
  it('rolls a focused practice prompt that can be started or saved', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/art-roulette']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /i don't know what to create/i })).toBeVisible();
    expect(screen.getByText('25-Minute Gouache Flower Study')).toBeVisible();
    expect(screen.getByText('Maximum 5 Colours')).toBeVisible();

    await user.click(screen.getByRole('button', { name: /roll again/i }));
    expect(screen.getByText('20-Minute Pencil Hand Study')).toBeVisible();

    await user.click(screen.getByRole('button', { name: /save for later/i }));
    expect(screen.getByRole('button', { name: /saved for later/i })).toBeVisible();

    await user.click(screen.getByRole('button', { name: /start practice/i }));
    expect(screen.getByRole('heading', { name: /20-minute pencil hand study/i })).toBeVisible();
  });
});
