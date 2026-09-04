import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('ProgressPage', () => {
  it('turns recent practice into a useful next exercise', () => {
    render(<MemoryRouter initialEntries={['/progress']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /your practice ledger/i })).toBeVisible();
    expect(screen.getByLabelText('Practice hours this week')).toBeVisible();
    expect(screen.getByText(/haven't worked on perspective recently/i)).toBeVisible();
    expect(screen.getByRole('link', { name: /20-minute perspective exercise/i })).toHaveAttribute('href', '/practice/ref-architecture-two');
  });
});
