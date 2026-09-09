import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ReferencePacksPage', () => {
  it('uses a portrait pack to move between connected study views', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/reference-packs']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /portrait reference pack/i })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Front View' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Lighting Diagram' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Value Study' })).toBeVisible();
    expect(screen.getByText(/face proportions & placement/i)).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Grayscale Reference' }));
    expect(screen.getByRole('button', { name: 'Grayscale Reference' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/values before colour/i)).toBeVisible();
    expect(screen.getByRole('link', { name: /start portrait practice/i })).toHaveAttribute('href', '/practice/ref-portrait');
  });
});
