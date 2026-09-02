import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { OnboardingFlow } from './OnboardingFlow';

describe('OnboardingFlow', () => {
  it('turns selected preferences into a practice invitation', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><OnboardingFlow onComplete={vi.fn()} /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /developing/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));
    await user.click(screen.getByRole('button', { name: /drawing/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));
    await user.click(screen.getByRole('button', { name: /build a daily habit/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));
    await user.click(screen.getByRole('button', { name: /portrait/i }));
    await user.click(screen.getByRole('button', { name: /see my practice/i }));
    expect(screen.getByText(/your first practice is ready/i)).toBeVisible();
  });
});
