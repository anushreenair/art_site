import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('LearningPathsPage', () => {
  it('opens a practice-first portrait journey and links its lessons to the workspace', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/learning']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /learning paths/i })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /learn portrait painting/i }));

    const journey = screen.getByLabelText('Learn Portrait Painting journey');
    expect(within(journey).getByText('Face Proportions')).toBeVisible();
    expect(within(journey).getByText('Three-Quarter Portrait')).toBeVisible();
    expect(within(journey).getAllByRole('link', { name: /start practice/i })[0]).toHaveAttribute('href', '/practice/ref-portrait');
  });
});
