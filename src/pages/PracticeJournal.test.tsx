import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';

const storedEntries = Array.from({ length: 6 }, (_, index) => ({
  id: `skin-tone-${index}`,
  sessionTitle: '30-Minute Watercolour Portrait',
  createdAt: `2026-09-0${index + 1}T10:00:00.000Z`,
  worked: 'I kept the values simple.',
  difficult: 'Skin tones kept turning grey.',
  learned: 'Start with a warmer base.',
  improve: 'Skin tones',
}));

describe('PracticeJournal', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      clear: () => storage.clear(),
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    } });
  });

  it('offers an optional reflection after a practice finishes and saves it', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/build-practice']}><App /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'Generate my practice' }));
    await user.click(screen.getByRole('button', { name: 'Finish Practice' }));

    expect(screen.getByRole('heading', { name: /a few words for the work/i })).toBeVisible();
    await user.type(screen.getByLabelText(/what worked today/i), 'The first wash stayed clean.');
    await user.type(screen.getByLabelText(/what was difficult/i), 'Skin tones felt too cool.');
    await user.click(screen.getByRole('button', { name: 'Save reflection' }));

    expect(screen.getByText('Reflection saved.')).toBeVisible();
    expect(window.localStorage.getItem('atelier-practice-journal')).toContain('Skin tones felt too cool.');
  });

  it('turns repeated reflections into a focused next practice recommendation', () => {
    window.localStorage.setItem('atelier-practice-journal', JSON.stringify(storedEntries));
    render(<MemoryRouter initialEntries={['/journal']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /practice journal/i })).toBeVisible();
    expect(screen.getByText(/you've mentioned difficulty with skin tones during 6 recent sessions/i)).toBeVisible();
    expect(screen.getByRole('link', { name: /20-minute skin tone study/i })).toBeVisible();
  });
});
