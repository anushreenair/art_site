import { parseSearchQuery } from './intent';
const key = 'atelier.recent-searches';
export function recentSearches(): string[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0 && item.length <= 500))].slice(0, 8) : [];
  } catch { return []; }
}
export function rememberSearch(query: string) {
  const next = [query, ...recentSearches().filter(item => item.toLowerCase() !== query.toLowerCase())].slice(0, 8);
  try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* Search still works without storage. */ }
  return next;
}
export function clearSearchHistory() { try { window.localStorage.removeItem(key); } catch { /* Private mode may disallow storage. */ } }
export function personalSuggestions(recent: string[]) {
  const interest = recent.map(parseSearchQuery).find(item => item.subject || item.medium || item.skill);
  if (!interest) return ['Beginner drawing practice', 'Explore colour mixing'];
  return [...new Set([interest.subject && `${interest.subject} references`, interest.medium && `Beginner ${interest.medium}`, interest.skill && `Practice ${interest.skill}`].filter((item): item is string => Boolean(item)))];
}
