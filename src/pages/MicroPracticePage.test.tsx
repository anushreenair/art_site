import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('MicroPracticePage', () => {
  it('turns a few available minutes into a focused exercise and reflection', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/micro-practice']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /make five minutes count/i })).toBeVisible();
    await user.click(screen.getByRole('button', { name: '5 minutes' }));
    expect(screen.getByRole('button', { name: '5 minutes' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'Paint One Eye' })).toBeVisible();
    expect(screen.getByText('Skin Tones')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Start micro practice' }));
    expect(screen.getByRole('heading', { name: 'Paint One Eye' })).toBeVisible();
    expect(screen.getByLabelText('Micro-practice timer')).toHaveTextContent('05:00');

    await user.click(screen.getByRole('button', { name: 'Finish micro practice' }));
    expect(screen.getByRole('heading', { name: /a few words for the work/i })).toBeVisible();
  });
});
