import { describe, expect, it, vi } from 'vitest';
import { GET } from './image-search';

describe('GET /api/image-search', () => {
  it('validates the query before calling Openverse', async () => {
    const response = await GET(new Request('http://localhost/api/image-search?q='));
    expect(response.status).toBe(400);
  });

  it('normalizes free Openverse image results without an API key', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(JSON.stringify({ results: [{ thumbnail: 'https://img.example/thumb.jpg', url: 'https://img.example/full.jpg', title: 'Cat sketch', creator: 'A. Artist', foreign_landing_url: 'https://example.com/cat', width: 400, height: 500, license: 'cc0', license_version: '1.0' }] }), { status: 200 }));
    const response = await GET(new Request('http://localhost/api/image-search?q=cat%20pencil'));
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('page_size=100'), expect.objectContaining({ headers: expect.objectContaining({ Accept: 'application/json' }) }));
    expect(await response.json()).toEqual({ ok: true, results: [{ thumbnail: 'https://img.example/thumb.jpg', imageUrl: 'https://img.example/full.jpg', title: 'Cat sketch', source: 'Openverse · A. Artist', sourceUrl: 'https://example.com/cat', width: 400, height: 500, creator: 'A. Artist', license: 'CC0 1.0' }] });
    fetchMock.mockRestore();
  });
});