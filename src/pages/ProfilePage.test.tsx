import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ProfilePage', () => {
  it('shows an artist studio and lets the artist edit their profile', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Mira Sol' })).toBeVisible();
    expect(screen.getByText('Artwork completed')).toBeVisible();
    expect(screen.getByText('Portrait — Level 7')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Recent work' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    expect(screen.getByLabelText('Artist name')).toHaveValue('Mira Sol');
    await user.clear(screen.getByLabelText('Artist name'));
    await user.type(screen.getByLabelText('Artist name'), 'Mira Vale');
    await user.click(screen.getByRole('button', { name: 'Save profile' }));
    expect(screen.getByRole('heading', { name: 'Mira Vale' })).toBeVisible();
  });
});
