import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('Work-in-Progress Critique', () => {
  it('adapts an early-stage critique to sketch fundamentals', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/practice/ref-portrait']}><App /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /check my progress/i }));
    expect(screen.getByRole('heading', { name: /what stage are you at/i })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Initial Sketch' }));
    await user.click(screen.getByRole('button', { name: /get stage feedback/i }));

    expect(screen.getByText('Sketch check')).toBeVisible();
    expect(screen.getByText('Proportion')).toBeVisible();
    expect(screen.getByText('Perspective')).toBeVisible();
    expect(screen.getByText('Placement')).toBeVisible();
    expect(screen.getByText('Composition')).toBeVisible();
    expect(screen.queryByText('Final brushwork')).not.toBeInTheDocument();
  });
});
