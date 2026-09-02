import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CategoryPicker } from './CategoryPicker';
import type { ArtCategory } from '../types/content';

const categories: ArtCategory[] = [
  { id: 'portrait', label: 'Portrait', imageUrl: 'https://images.unsplash.com/photo-1', alt: 'Portrait study' },
  { id: 'flowers', label: 'Flowers', imageUrl: 'https://images.unsplash.com/photo-2', alt: 'Flower study' },
];

describe('CategoryPicker', () => {
  it('sends the chosen subject to the session', async () => {
    const user = userEvent.setup();
    const choose = vi.fn();
    render(<CategoryPicker categories={categories} onSelect={choose} />);

    await user.click(screen.getByRole('button', { name: /portrait/i }));
    expect(choose).toHaveBeenCalledWith(categories[0]);
  });
});
