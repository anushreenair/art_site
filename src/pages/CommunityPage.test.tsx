import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('CommunityPage', () => {
  it('lets an artist request and give structured critique', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/community']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /the critique studio/i })).toBeVisible();
    expect(screen.getByTestId('community-hero-copy')).toContainElement(screen.getByRole('heading', { name: /the critique studio/i }));
    expect(screen.getByText('Critique welcome')).toBeVisible();
    expect(screen.getByText('Helpful Critic')).toBeVisible();
    expect(screen.getByText("You've found enough inspiration.")).toBeVisible();

    await user.click(screen.getAllByRole('button', { name: 'Request Critique' })[0]);
    expect(screen.getByRole('heading', { name: 'What would you like feedback on?' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Composition' }));
    await user.click(screen.getByRole('button', { name: 'Continue to Community Critique' }));
    expect(screen.getAllByText('Feedback requested')).toHaveLength(2);
    expect(screen.getByText('Requested: Composition · Balanced')).toBeVisible();

    await user.click(screen.getAllByRole('button', { name: 'Leave constructive feedback' })[0]);
    expect(screen.getByLabelText('What worked well')).toBeVisible();
    await user.type(screen.getByLabelText('What worked well'), 'The main value shapes are clear.');
    await user.type(screen.getByLabelText('What could improve'), 'The cast shadow could be grouped more simply.');
    await user.type(screen.getByLabelText('One suggestion'), 'Try a three-value thumbnail first.');
    await user.click(screen.getByRole('button', { name: 'Share feedback' }));
    expect(screen.getByText('Feedback shared')).toBeVisible();
  });
});
