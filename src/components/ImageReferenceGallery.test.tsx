import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImageReferenceGallery } from './ImageReferenceGallery';

afterEach(() => vi.restoreAllMocks());

describe('ImageReferenceGallery', () => {
  it('loads a large image result set and opens a preview modal', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: true, results: Array.from({ length: 12 }, (_, index) => ({ thumbnail: `https://img.example/${index}.jpg`, imageUrl: `https://img.example/full-${index}.jpg`, title: `Cat study ${index}`, source: 'Example', sourceUrl: 'https://example.com/cat', width: 400, height: 500 })) }), { status: 200 }));
    const user = userEvent.setup();
    render(<MemoryRouter><ImageReferenceGallery query="cat pencil sketch" /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('12 image references')).toBeInTheDocument());
    expect(screen.getAllByRole('img')).toHaveLength(12);
    await user.click(screen.getByRole('button', { name: 'Open Cat study 0' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Original' })).toHaveAttribute('href', 'https://example.com/cat');
  });
});