import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('FinishPiecePage', () => {
  it('turns an unfinished upload and a stopping point into a focused finish plan', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/finish-piece']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /finish my piece/i })).toBeVisible();
    await user.upload(screen.getByLabelText(/upload unfinished artwork/i), new File(['art'], 'unfinished-portrait.png', { type: 'image/png' }));
    await user.click(screen.getByRole('button', { name: 'I’m Afraid I’ll Ruin It' }));
    await user.click(screen.getByRole('button', { name: /generate finishing plan/i }));

    expect(screen.getByRole('heading', { name: 'You are currently in the refinement stage.' })).toBeVisible();
    expect(screen.getByText('Do not restart.')).toBeVisible();
    expect(screen.getByText('Resolve the background.')).toBeVisible();
    expect(screen.getByText('35 minutes')).toBeVisible();

    await user.click(screen.getByRole('button', { name: /start finish session/i }));
    expect(screen.getByRole('button', { name: /pause finish session/i })).toBeVisible();
  });
});
