import { describe, expect, it } from 'vitest';
import { POST } from './search';

describe('POST /api/search', () => {
  it('rejects empty or oversized queries', async () => {
    const response = await POST(new Request('http://localhost/api/search', { method: 'POST', body: JSON.stringify({ query: '' }) }));
    expect(response.status).toBe(400);
  });

  it('returns a safe fallback when Qwen is not configured', async () => {
    const previousKey = process.env.QWEN_API_KEY;
    delete process.env.QWEN_API_KEY;
    const response = await POST(new Request('http://localhost/api/search', { method: 'POST', body: JSON.stringify({ query: 'watercolor portrait', results: [] }) }));
    if (previousKey) process.env.QWEN_API_KEY = previousKey;
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, enhanced: false });
  });
});
import { afterEach, vi } from 'vitest';
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
it('rejects null bodies safely', async () => {
  expect((await POST(new Request('http://localhost/api/search', {method: 'POST', body: 'null'}))).status).toBe(400);
});
it('uses official web options and provider source metadata, never invented source URLs', async () => {
  vi.stubEnv('QWEN_API_KEY', 'test-key');
  const upstream = vi.fn().mockResolvedValue(new Response(JSON.stringify({ output: {
    choices: [{message: {content: JSON.stringify({answer: 'See [1].', sources: [{title: 'Invented', url: 'https://invented.test'}]})}}],
    search_info: {search_results: [{index: 1, title: 'Real source', url: 'https://example.org/call'}, {index: 2, title: 'Unsafe', url: 'javascript:alert(1)'}]},
  }})));
  vi.stubGlobal('fetch', upstream);
  const response = await POST(new Request('http://localhost/api/search', {method: 'POST', body: JSON.stringify({query: 'exhibitions near Delhi'})}));
  const sent = JSON.parse(upstream.mock.calls[0][1].body);
  expect(sent.parameters.enable_search).toBe(true);
  expect(sent.parameters.search_options.enable_source).toBe(true);
  expect(await response.json()).toMatchObject({sources: [{title: 'Real source', url: 'https://example.org/call', index: 1}], external: true});
});
it('disables web search for internal queries and rejects invented ranking IDs', async () => {
  vi.stubEnv('QWEN_API_KEY', 'test-key');
  const upstream = vi.fn().mockResolvedValue(new Response(JSON.stringify({output: {choices: [{message: {content: JSON.stringify({rankedIds: ['invented', 'ref-flowers'], intent: {medium: 'Watercolour'}, relatedSearches: ['Flower washes']})}}]}})));
  vi.stubGlobal('fetch', upstream);
  const response = await POST(new Request('http://localhost/api/search', {method: 'POST', body: JSON.stringify({query: 'watercolor flowers', results: 'invalid'})}));
  expect(JSON.parse(upstream.mock.calls[0][1].body).parameters.enable_search).toBe(false);
  expect((await response.json()).rankedIds).toEqual(['ref-flowers']);
});
it('explicit web requests trigger search even for ordinary art terms', async () => {
  vi.stubEnv('QWEN_API_KEY', 'test-key');
  const upstream = vi.fn().mockResolvedValue(new Response(JSON.stringify({output: {choices: [{message: {content: '{}'}}]}})));
  vi.stubGlobal('fetch', upstream);
  const response = await POST(new Request('http://localhost/api/search', {method: 'POST', body: JSON.stringify({query: 'watercolor flowers', web: true})}));
  expect(JSON.parse(upstream.mock.calls[0][1].body).parameters.enable_search).toBe(true);
  expect((await response.json()).status).toBe('unverified');
});
