import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('DigitiseArtworkPage', () => {
  it('keeps the artwork untouched while preparing a photograph for export', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/digitise']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /digitise my artwork/i })).toBeVisible();
    expect(screen.getByText(/does not alter or regenerate your artwork/i)).toBeVisible();

    await user.upload(screen.getByLabelText(/upload an artwork photograph/i), new File(['photo'], 'portrait-on-canvas.jpg', { type: 'image/jpeg' }));
    expect(screen.getAllByText('portrait-on-canvas.jpg')[0]).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Perspective Correction' }));
    expect(screen.getByRole('button', { name: 'Perspective Correction' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Artwork photograph preview')).toHaveAttribute('data-perspective', 'true');

    await user.click(screen.getByRole('button', { name: 'Portfolio Export' }));
    expect(screen.getByText('Portfolio export is ready to download.')).toBeVisible();
  });
});
