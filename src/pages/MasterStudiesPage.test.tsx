import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('MasterStudiesPage', () => {
  it('turns a public-domain master work into targeted practice activities', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/masters']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /master studies/i })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /girl with a pearl earring/i }));

    const study = screen.getByLabelText('Girl with a Pearl Earring study');
    expect(within(study).getByText('Composition analysis')).toBeVisible();
    expect(within(study).getByText('Study only the shadows.')).toBeVisible();
    expect(within(study).getByRole('link', { name: /15-minute value study/i })).toHaveAttribute('href', '/practice/ref-portrait');
  });
});
