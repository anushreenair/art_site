import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { SearchPage } from './SearchPage';

describe('SearchPage', () => {
  it('renders internal results for a URL query', () => {
    render(<MemoryRouter initialEntries={['/search?q=watercolor+flowers']}><Routes><Route path="/search" element={<SearchPage />} /></Routes></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /search results/i })).toBeInTheDocument();
    expect(screen.getByText('Tulips in a glass')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'View Reference' }).find((link) => link.getAttribute('href') === '/practice/ref-flowers')).toBeTruthy();
  });

  it('offers recovery actions when there are no exact matches', () => {
    render(<MemoryRouter initialEntries={['/search?q=moon+made+of+glass']}><Routes><Route path="/search" element={<SearchPage />} /></Routes></MemoryRouter>);
    expect(screen.getByText('No exact match found.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Generate a Practice' })).toBeInTheDocument();
  });
});
import { afterEach, vi } from 'vitest';
afterEach(() => vi.unstubAllGlobals());
it('shows an AI answer and citations even with no internal match', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({enhanced: true, status: 'ready', answer: 'An exhibition is open [1].', sources: [{title:'Gallery', url:'https://example.org', index:1}], external:true}))));
  render(<MemoryRouter initialEntries={['/search?q=exhibitions+near+Delhi']}><SearchPage /></MemoryRouter>);
  expect(await screen.findByText(/An exhibition is open/)).toBeInTheDocument();
  expect(screen.getByRole('link', {name: '[1] Gallery ↗'})).toHaveAttribute('href', 'https://example.org');
  expect(screen.getByRole('link', {name: 'Search the Web'}).getAttribute('href')).toContain('web=1');
});
it('keeps internal results with an explicit unavailable status', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({enhanced:false, status:'not-configured'}))));
  render(<MemoryRouter initialEntries={['/search?q=watercolor+flowers']}><SearchPage /></MemoryRouter>);
  expect(await screen.findByText(/AI search is not configured/)).toBeInTheDocument();
  expect(screen.getByText('Tulips in a glass')).toBeInTheDocument();
});
