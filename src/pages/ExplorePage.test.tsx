import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ExplorePage', () => {
  it('narrows the reference desk by subject', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/explore']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /find the study/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /18 studies/i })).toBeVisible();
    await user.click(screen.getAllByRole('button', { name: 'Portrait' })[1]);
    expect(screen.getByRole('heading', { name: /2 studies/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Window-light portrait' })).toBeVisible();
  });

  it('shows declared reference rights and filters to public-domain studies', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/explore']}><App /></MemoryRouter>);

    expect(screen.getAllByText('Public Domain').length).toBeGreaterThan(0);
    expect(screen.getByText(/rights are declared for every study/i)).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Public Domain' }));
    expect(screen.getByRole('heading', { name: /4 studies/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Three objects, one lamp' })).toBeVisible();
  });
});
