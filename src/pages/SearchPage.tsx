import { ArrowUpRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ImageReferenceGallery } from '../components/ImageReferenceGallery';
import { getSearchSuggestions, parseSearchQuery, practiceSearchUrl, searchInternal, starterSearches, type SearchResult, type SearchTab } from '../lib/search';
import { searchTabs, validateIntent } from '../lib/search/intent';
import { getSavedSearchDocuments } from '../lib/search/saved';
import { useSearchEnhancement, type SearchSource } from '../lib/search/useSearchEnhancement';

const messages: Record<string, string> = {
  loading: 'Searching Atelier first. Qwen is refining your results…',
  'not-configured': 'AI search is not configured yet. You can still search Atelier content.',
  'configuration-error': 'Qwen could not authenticate or use the configured endpoint. Internal search is available.',
  unavailable: 'AI search is temporarily unavailable. Internal search is still available.',
  unverified: 'No current web sources could be verified. Try a more specific place or date.',
  'location-required': 'Add a city to search near you, for example “art competitions in Mumbai”.',
};
function queryUrl(query: string, extra: Record<string, string> = {}) { return `/search?${new URLSearchParams({ q: query, ...extra })}`; }
export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q')?.trim() ?? '';
  const selected = params.get('tab') as SearchTab;
  const activeTab = searchTabs.includes(selected) ? selected : 'All';
  const imageMode = params.get('mode') === 'images';
  const web = params.get('web') === '1';
  const [retry, setRetry] = useState(0);
  const enhanced = useSearchEnhancement(query, web, !imageMode, retry);
  const filters = useMemo(() => validateIntent(enhanced.intent, parseSearchQuery(query)), [query, enhanced.intent]);
  const saved = useMemo(() => getSavedSearchDocuments(), [query]);
  const allResults = useMemo(() => query.length <= 500 ? searchInternal(query, 'All', filters, false, saved) : [], [query, filters, saved]);
  const results = allResults.filter(item => activeTab === 'All' || item.type === activeTab);
  const rank = new Map((Array.isArray(enhanced.rankedIds) ? enhanced.rankedIds : []).map((id, index) => [id, index]));
  const ordered = [...results].sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity));
  const related = useMemo(() => searchInternal(query, activeTab, filters, true, saved).filter(item => !allResults.some(exact => exact.id === item.id)).slice(0, 6), [query, activeTab, filters, saved, allResults]);
  const suggestions = Array.isArray(enhanced.relatedSearches) && enhanced.relatedSearches.length ? enhanced.relatedSearches : getSearchSuggestions(query);
  const sources = (Array.isArray(enhanced.sources) ? enhanced.sources : []).filter(source => /^https?:\/\//i.test(source.url));
  const status = query.length > 500 ? 'Please shorten your search to 500 characters.' : messages[enhanced.status ?? ''];
  const chips = Object.entries(filters).filter(([key, value]) => value !== undefined && !['current', 'needsLocation', 'opportunityType'].includes(key));

  return <AppShell><section className="search-page">
    <header className="search-page-header"><p className="eyebrow">One search. Your whole studio.</p><h1>Search results</h1><p className="search-query"><Search size={16} aria-hidden="true" />{query || 'What would you like to make today?'}</p><div className="search-filter-chips">{chips.map(([key, value]) => <span key={key}>{key === 'durationMinutes' ? `Up to ${value} minutes` : key === 'free' ? 'Free entry' : String(value)}</span>)}</div></header>
    <nav className="search-mode-tabs" aria-label="Search modes"><Link aria-current={!imageMode ? 'page' : undefined} className={!imageMode ? 'active' : ''} to={queryUrl(query)}>Atelier results</Link><Link aria-current={imageMode ? 'page' : undefined} className={imageMode ? 'active' : ''} to={queryUrl(query, {mode: 'images'})}>Image references</Link></nav>
    {imageMode ? <ImageReferenceGallery query={query} /> : <>
      <nav className="search-tabs" aria-label="Search categories">{searchTabs.map(tab => <Link key={tab} aria-current={tab === activeTab ? 'page' : undefined} className={tab === activeTab ? 'active' : ''} to={queryUrl(query, { ...(tab === 'All' ? {} : {tab}), ...(web ? {web: '1'} : {}) })}>{tab}<span className="search-category-count">{tab === 'All' ? allResults.length : allResults.filter(item => item.type === tab).length}</span></Link>)}</nav>
      {!query ? <section className="search-discovery"><h2>A little inspiration to begin</h2><div className="search-related">{starterSearches.map(item => <Link key={item} to={queryUrl(item)}>{item} ↗</Link>)}</div></section> : <>
        {status && <div className="search-service-status" role="status"><p>{status}</p>{['unavailable', 'unverified', 'configuration-error'].includes(enhanced.status ?? '') && <button onClick={() => setRetry(value => value + 1)}>Retry AI search</button>}</div>}
        {enhanced.answer && <aside className="search-answer"><p className="eyebrow">{enhanced.external ? 'From the web' : 'A note for your practice'} · Qwen</p><p><CitedAnswer text={enhanced.answer} sources={sources} /></p></aside>}
        {sources.length > 0 && <section className="search-sources" aria-label="Web sources"><h2>Sources from web search</h2>{sources.map(source => <a key={source.url} id={`search-source-${source.index}`} href={source.url} target="_blank" rel="noopener noreferrer">[{source.index}] {source.title} ↗</a>)}{enhanced.retrievedAt && <small>Retrieved {new Date(enhanced.retrievedAt).toLocaleDateString()}</small>}</section>}
        {ordered.length ? <section className="search-results" aria-label={`${activeTab} results`}><p className="search-result-count">{ordered.length} internal {ordered.length === 1 ? 'result' : 'results'}{filters.current ? ' · Local listings are not verified live; check cited sources for current availability.' : ''}</p><ResultGrid results={ordered} /></section> : <section className="search-empty"><p className="eyebrow">A different route</p><h2>No exact match found.</h2><p>Try a related study, or turn your idea into a practice.</p><div className="search-empty-actions"><Link to={queryUrl(filters.subject ?? filters.medium ?? 'portrait', {tab: 'References'})}>Related references</Link><Link to={queryUrl(filters.subject ?? filters.skill ?? 'practice', {tab: 'Practice'})}>Similar practice sessions</Link><Link to={practiceSearchUrl(filters)}>Generate a Practice</Link><Link to={queryUrl(query, {web: '1'})}>Search the Web</Link></div></section>}
        {!ordered.length && related.length > 0 && <section className="search-related-results"><h2>Nearby ideas</h2><p>These alternatives match some of your interests. Their medium, level, or time may differ.</p><ResultGrid results={related} /></section>}
        {suggestions.length > 0 && <section className="search-related"><h2>Related searches</h2>{suggestions.map(item => <Link key={item} to={queryUrl(item)}>{item} ↗</Link>)}</section>}
      </>}
    </>}
  </section></AppShell>;
}
function ResultGrid({ results }: { results: SearchResult[] }) {
  return <div className="search-result-grid">{results.map(result => <article className="search-result-card" key={result.id}>{result.imageUrl && <img src={result.imageUrl} alt="" loading="lazy" />}<div className="search-result-card-body"><p className="eyebrow">{result.type}</p><h2>{result.title}</h2><p>{result.description.length > 240 ? `${result.description.slice(0, 237)}…` : result.description}</p><div className="search-result-meta">{[...new Set(result.metadata)].slice(0, 4).map(item => <span key={item}>{item}</span>)}</div><Link to={result.actionTo}>{result.actionLabel}<ArrowUpRight size={15} aria-hidden="true" /></Link></div></article>)}</div>;
}
function CitedAnswer({ text, sources }: { text: string; sources: SearchSource[] }) {
  return <>{text.split(/(\[\d+\])/).map((part, i) => { const source = sources.find(item => `[${item.index}]` === part); return source ? <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`Source ${source.index}: ${source.title}`}>{part}</a> : part; })}</>;
}
