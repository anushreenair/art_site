import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ManyArtistsPage', () => {
  it('shows many valid interpretations of one reference and filters them by medium', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/many-artists']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /one reference, many artists/i })).toBeVisible();
    expect(screen.getByText(/there is no single correct outcome/i)).toBeVisible();
    expect(screen.getByText('Window-light portrait')).toBeVisible();
    expect(screen.getAllByText('Beginner attempt')[0]).toBeVisible();
    expect(screen.getAllByText('Advanced attempt')[0]).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Watercolour' }));
    expect(screen.getByRole('button', { name: 'Watercolour' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Soft window, watercolour')).toBeVisible();
    expect(screen.queryByText('Memory in charcoal')).not.toBeInTheDocument();
  });
});
