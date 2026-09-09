import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ComparePage', () => {
  it('shows comparison modes and saves an attempt locally', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/compare/ref-portrait']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /reference.*my artwork/i })).toBeVisible();
    expect(screen.getByLabelText('Upload your artwork')).toBeVisible();
    expect(screen.getByText('Practice duration')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Overlay' }));
    expect(screen.getByLabelText('Artwork comparison')).toHaveAttribute('data-mode', 'overlay');

    await user.click(screen.getByRole('button', { name: 'Save attempt to profile' }));
    expect(screen.getByText('Attempt saved to profile')).toBeVisible();
    expect(screen.getByRole('heading', { name: /a few words for the work/i })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Skip for now' }));

    await user.click(screen.getByRole('button', { name: 'Generate studio critique' }));
    expect(screen.getByRole('heading', { name: 'What would you like feedback on?' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Lighting' }));
    await user.click(screen.getByRole('button', { name: 'Direct' }));
    await user.click(screen.getByRole('button', { name: 'Continue to AI Critique' }));
    expect(screen.getByRole('heading', { name: 'What worked well' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'What could improve' })).toBeVisible();
    expect(screen.getByText('Requested focus: Lighting · Direct')).toBeVisible();
    expect(screen.getByText(/facial proportions are strong/i)).toBeVisible();
  });
});
