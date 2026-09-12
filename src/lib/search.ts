import { getSearchDocuments } from './search/catalog';
import { normalize, parseSearchQuery } from './search/intent';
import type { SearchFilters, SearchTab, SearchResult, SearchDocument } from './search/types';
export { getSearchDocuments, parseSearchQuery };
export type { SearchTab, SearchFilters, SearchDocument, SearchResult } from './search/types';

const stopWords = new Set('i a an the to for in on of with and want would like please me my you can could how do does is it made draw drawing paint painting learn teach practice practise reference references lesson lessons art artist artists minute minutes min hour hours easy beginner advanced intermediate this month current happening near now free competitions competition exhibition exhibitions open calls call'.split(' '));
export function searchInternal(query: string, tab: SearchTab = 'All', intent?: SearchFilters, related = false, additionalDocuments: SearchDocument[] = []): SearchResult[] {
  if (!query.trim()) return [];
  const filters = intent ?? parseSearchQuery(query);
  const tokens = normalize(query).split(' ').filter(token => token.length > 1 && !stopWords.has(token) && !/^\d+$/.test(token));
  const results = [...getSearchDocuments(), ...additionalDocuments].filter(item => tab === 'All' || item.type === tab).map(item => {
    const matchedFilters: string[] = [];
    let mismatches = 0;
    let score = 0;
    const searchable = ` ${item.searchText} `;
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || ['current', 'needsLocation'].includes(key)) continue;
      let matches: boolean;
      if (key === 'type') matches = item.type === value;
      else if (key === 'durationMinutes') matches = Boolean(item.filters?.durationMinutes && item.filters.durationMinutes <= Number(value));
      else if (key === 'free') matches = item.filters?.free === value;
      else {
        const actual = item.filters?.[key as keyof SearchFilters];
        matches = typeof actual === 'string' ? normalize(actual).includes(normalize(String(value))) : searchable.includes(` ${normalize(String(value))} `);
      }
      if (matches) { score += 8; matchedFilters.push(String(value)); } else mismatches++;
    }
    const hits = tokens.filter(token => searchable.includes(` ${token} `)).length;
    score += hits * 3;
    if (normalize(item.title).includes(normalize(query))) score += 12;
    const hasArtFilter = Boolean(filters.subject || filters.medium || filters.skill || filters.location || filters.opportunityType);
    const textMatches = tokens.length === 0 || hits === tokens.length || (hasArtFilter && hits > 0);
    return { ...item, score, matchedFilters, exact: mismatches === 0 && textMatches, mismatches };
  });
  return results.filter(item => related ? item.score > 0 : item.exact && item.score > 0)
    .sort((a, b) => (related ? a.mismatches - b.mismatches : 0) || b.score - a.score);
}
export function practiceSearchUrl(filters: SearchFilters) {
  const params = new URLSearchParams();
  for (const key of ['subject', 'medium', 'difficulty', 'skill', 'durationMinutes'] as const) if (filters[key]) params.set(key, String(filters[key]));
  return `/build-practice?${params}`;
}
export const starterSearches = ['Portrait references', 'Watercolor landscapes', 'Practice skin tones', 'Draw hands for 10 minutes', 'Beginner perspective', 'Art competitions near me'];
export function getSearchSuggestions(query: string) {
  if (!query.trim()) return starterSearches;
  const words = normalize(query).split(' ').filter(Boolean);
  const pool = [...starterSearches, ...getSearchDocuments().map(item => item.title)];
  const matches = pool.filter(value => words.every(word => normalize(value).includes(word)));
  return [...new Set(matches)].slice(0, 6);
}
