import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ArtBoxPage', () => {
  it('lets an artist manage materials in a named watercolour box', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/art-box']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /my art box/i })).toBeVisible();
    expect(screen.getByText('My Watercolour Box')).toBeVisible();
    expect(screen.getByRole('checkbox', { name: 'Ultramarine' })).toBeChecked();

    await user.click(screen.getByRole('checkbox', { name: 'Ultramarine' }));
    expect(screen.getByRole('checkbox', { name: 'Ultramarine' })).not.toBeChecked();
  });

  it('shows a practice-readiness message and an alternative where a material is missing', () => {
    render(<MemoryRouter initialEntries={['/practice/ref-nature']}><App /></MemoryRouter>);
    expect(screen.getByText('You are missing Viridian.')).toBeVisible();
    expect(screen.getByText(/Sap Green.*Ultramarine/i)).toBeVisible();
  });
});
