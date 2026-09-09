import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('StudioSessionsPage', () => {
  it('lets an artist join a quiet room and choose how to practise together', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/sessions']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /studio sessions/i })).toBeVisible();
    expect(screen.getByText('45-Minute Portrait Study')).toBeVisible();
    expect(screen.getByText(/no feed\. no performance/i)).toBeVisible();

    await user.click(screen.getAllByRole('button', { name: /join session/i })[0]);
    expect(screen.getByText('Shared timer')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Use Same Reference' }));
    expect(screen.getByRole('button', { name: 'Use Same Reference' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Share Result at End' }));
    expect(screen.getByLabelText('Upload session result')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Request Critique' })).toBeVisible();
  });
});
