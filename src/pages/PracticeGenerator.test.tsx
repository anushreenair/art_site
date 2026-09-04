import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('PracticeGenerator', () => {
  it('builds a personal practice and starts its timer', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/build-practice']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /what do you want to practise/i })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Portrait' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Generate my practice' }));
    expect(screen.getByRole('heading', { name: /30-minute intermediate watercolour portrait/i })).toBeVisible();
    expect(screen.getByText('Focus: Lighting + Skin Tones')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getByRole('button', { name: 'Pause' })).toBeVisible();
  });
});
