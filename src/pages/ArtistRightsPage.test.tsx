import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ArtistRightsPage', () => {
  it('keeps AI training opt-in disabled while exposing every artwork permission', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/artist-rights']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /your artwork remains yours/i })).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Private' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Allow AI Improvement / Training' })).not.toBeChecked();

    await user.click(screen.getByRole('radio', { name: 'Public' }));
    expect(screen.getByRole('radio', { name: 'Public' })).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'Allow AI Improvement / Training' }));
    expect(screen.getByRole('checkbox', { name: 'Allow AI Improvement / Training' })).toBeChecked();
    expect(screen.getByText(/you can switch this off at any time/i)).toBeVisible();
  });
});
