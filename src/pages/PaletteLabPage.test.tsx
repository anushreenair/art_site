import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('PaletteLabPage', () => {
  it('offers an approximate paint-mix reading when an artist chooses a reference colour', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/palette-lab/ref-portrait']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /palette lab/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Warm medium skin tone' })).toBeVisible();
    expect(screen.getByText('Yellow Ochre')).toBeVisible();
    expect(screen.getByText(/pigment results vary/i)).toBeVisible();

    await user.click(screen.getByRole('button', { name: /choose a colour from the reference/i }));
    expect(screen.getByRole('heading', { name: 'Cool window shadow' })).toBeVisible();
    expect(screen.getByText('Ultramarine')).toBeVisible();
  });

  it('links the practice workspace to its palette lab', async () => {
    render(<MemoryRouter initialEntries={['/practice/ref-portrait']}><App /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /open palette lab/i })).toHaveAttribute('href', '/palette-lab/ref-portrait');
  });
});
