import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CreationBoundary } from './CreationBoundary';

describe('CreationBoundary', () => {
  it('moves an artist from a short set of inspiration into practice', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CreationBoundary startTo="/build-practice" onShowMore={() => undefined} /></MemoryRouter>);

    expect(screen.getByText("You've found enough inspiration.")).toBeVisible();
    expect(screen.getByText('Choose one and start creating.')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Start Practice' })).toHaveAttribute('href', '/build-practice');
    expect(screen.getByRole('button', { name: 'Show Me 5 More' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Save For Later' }));
    expect(screen.getByRole('button', { name: 'Saved For Later' })).toBeVisible();
  });
});
