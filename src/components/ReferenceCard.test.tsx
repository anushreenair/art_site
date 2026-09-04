import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { referenceStudies } from '../data/atelier-data';
import { ReferenceCard } from './ReferenceCard';

describe('ReferenceCard', () => {
  it('shows study metadata and opens its preview', async () => {
    const user = userEvent.setup();
    render(<ReferenceCard study={referenceStudies[0]} onStart={vi.fn()} />);
    expect(screen.getByText('Portrait')).toBeVisible();
    expect(screen.getByText('Beginner')).toBeVisible();
    expect(screen.getByText(/Pencil/)).toBeVisible();
    expect(screen.getByText(/20 minutes/)).toBeVisible();
    expect(screen.getAllByText('Personal Practice Only').length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: 'Preview Window-light portrait' }));
    expect(screen.getByRole('dialog', { name: 'Window-light portrait' })).toBeVisible();
  });
});
