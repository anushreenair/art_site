import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('BeforeAfterPage', () => {
  it('compares an artist’s own early and current work with personal observations', async () => {
    render(<MemoryRouter initialEntries={['/progress-compare']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /your work, over time/i })).toBeVisible();
    expect(screen.getByText('My First Portrait')).toBeVisible();
    expect(screen.getByText('My 40th Portrait')).toBeVisible();
    expect(screen.getByText('Proportion')).toBeVisible();
    expect(screen.getByText('Composition')).toBeVisible();
    expect(screen.getByText(/values used to be your weakest area/i)).toBeVisible();

    const slider = screen.getByLabelText('Personal progress comparison');
    fireEvent.change(slider, { target: { value: '70' } });
    expect(screen.getByLabelText('Personal progress comparison')).toHaveValue('70');
  });
});
