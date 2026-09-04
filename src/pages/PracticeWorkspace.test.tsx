import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('PracticeWorkspace', () => {
  it('opens a focused study with its guidance and image tools', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/practice/ref-portrait']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Window-light portrait' })).toBeVisible();
    expect(screen.getByText('Suggested materials')).toBeVisible();
    expect(screen.getByText('Suggested palette')).toBeVisible();
    expect(screen.getByText('Personal Practice Only · Study Only')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Grid overlay' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Hide guidance' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Flip horizontally' }));
    expect(screen.getByRole('img', { name: /portrait in soft window light/i })).toHaveAttribute('data-flipped', 'true');

    await user.click(screen.getByRole('button', { name: 'Crop' }));
    expect(screen.getByRole('img', { name: /portrait in soft window light/i })).toHaveAttribute('data-cropped', 'true');

    await user.click(screen.getByRole('button', { name: 'Hide guidance' }));
    expect(screen.queryByText('Suggested materials')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show guidance' })).toBeVisible();
  });
});
