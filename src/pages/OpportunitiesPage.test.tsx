import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('OpportunitiesPage', () => {
  it('helps artists filter opportunity listings by type and city', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/opportunities']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Opportunities' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Competitions' })).toBeVisible();
    expect(screen.getByText('Events near me')).toBeVisible();
    expect(screen.getByText('Closing soon')).toBeVisible();

    await user.click(screen.getByRole('tab', { name: 'Competitions' }));
    const browser = within(screen.getByLabelText('Browse opportunities'));
    expect(browser.getByText('Monsoon Prize for Contemporary Art')).toBeVisible();
    await user.selectOptions(screen.getByLabelText('City'), 'Mumbai');
    expect(browser.getByText('Mumbai Watercolour Open')).toBeVisible();
    expect(browser.queryByText('Monsoon Prize for Contemporary Art')).not.toBeInTheDocument();
  });
});
