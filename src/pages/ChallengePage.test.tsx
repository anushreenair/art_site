import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ChallengePage', () => {
  it('lets an artist join and complete the daily challenge', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/challenge']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /today's challenge/i })).toBeVisible();
    expect(screen.getByText(/participants/i)).toBeVisible();
    expect(screen.getByText('Daily streak')).toBeVisible();
    expect(screen.getByText("You've found enough inspiration.")).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Join Challenge' }));
    expect(screen.getByRole('link', { name: /open the workspace/i })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Complete challenge' }));
    expect(screen.getByLabelText('Upload your attempt')).toBeVisible();
  });
});
