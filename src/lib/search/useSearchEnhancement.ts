import { useEffect, useState } from 'react';
import type { SearchFilters } from './types';
export type SearchSource = { title: string; url: string; index: number };
export type Enhancement = { status?: string; intent?: SearchFilters; answer?: string; relatedSearches?: string[]; sources?: SearchSource[]; rankedIds?: string[]; external?: boolean; retrievedAt?: string };
export function useSearchEnhancement(query: string, web: boolean, enabled: boolean, retry: number) {
  const key = `${query}:${web}:${enabled}:${retry}`;
  const [state, setState] = useState<{ key: string; data: Enhancement }>({ key: '', data: {} });
  useEffect(() => {
    if (!enabled || !query || query.length > 500 || typeof fetch !== 'function') return;
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => { controller.abort(); if (active) setState({ key, data: { status: 'unavailable' } }); }, 28000);
    fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, web }), signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Search unavailable'); return response.json(); })
      .then((data: Enhancement) => { if (active) setState({ key, data: data && typeof data === 'object' ? data : { status: 'unavailable' } }); })
      .catch(() => { if (active) setState({ key, data: { status: 'unavailable' } }); })
      .finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [key, query, web, enabled]);
  return state.key === key ? state.data : { status: enabled && query && query.length <= 500 ? 'loading' : undefined } as Enhancement;
}
