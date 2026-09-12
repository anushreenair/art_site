import { Bookmark, ExternalLink, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export type ImageReference = { thumbnail: string; imageUrl: string; title: string; source: string; sourceUrl: string; width?: number; height?: number; creator?: string; license?: string };
type FilterKey = 'subject' | 'medium' | 'style' | 'orientation' | 'colour' | 'source' | 'rights';
type Filters = Record<FilterKey, string>;
const filterOptions: Record<FilterKey, string[]> = {
  subject: ['Portrait', 'Landscape', 'Animals', 'Flowers', 'Architecture', 'Still Life', 'Human Figure', 'Hands', 'Eyes'],
  medium: ['Pencil', 'Charcoal', 'Watercolor', 'Acrylic', 'Oil', 'Gouache', 'Pastel', 'Ink', 'Digital'],
  style: ['Realistic', 'Loose', 'Sketch', 'Line Art', 'Impressionist', 'Abstract', 'Minimal'],
  orientation: ['Portrait', 'Landscape', 'Square'], colour: ['Colour', 'Black & White', 'Warm', 'Cool'],
  source: ['Web', 'Open Licensed'], rights: ['All', 'Public Domain', 'Creative Commons'],
};
const emptyFilters: Filters = { subject: '', medium: '', style: '', orientation: '', colour: '', source: '', rights: '' };

function refinedQuery(query: string, filters: Filters) {
  const additions = [filters.style, filters.subject, filters.medium, filters.orientation, filters.source === 'Open Licensed' ? 'open licensed' : filters.source, filters.rights === 'All' ? '' : filters.rights, filters.colour === 'Black & White' ? 'black and white' : filters.colour].filter(Boolean);
  return [...new Set(`${query} ${additions.join(' ')}`.trim().split(/\s+/))].join(' ');
}

export function ImageReferenceGallery({ query }: { query: string }) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [results, setResults] = useState<ImageReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<ImageReference | null>(null);
  const [collectionSaved, setCollectionSaved] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const searchQuery = useMemo(() => refinedQuery(query, filters), [filters, query]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    fetch(`/api/image-search?q=${encodeURIComponent(searchQuery)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Image search is unavailable right now.')))
      .then((payload: { results?: ImageReference[]; error?: string }) => setResults(payload.results ?? []))
      .catch((reason: Error) => { if (reason.name !== 'AbortError') setError(reason.message); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [searchQuery]);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  function chooseFilter(key: FilterKey, value: string) { setFilters((current) => ({ ...current, [key]: current[key] === value ? '' : value })); }
  return <section className="image-reference-gallery" aria-label="Image references">
    <div className="image-gallery-heading"><div><p className="eyebrow">Web image references</p><h2>{query || 'Art references'}</h2><p>Images stay on their original websites. Rights are shown for private study.</p></div><button className="filter-toggle" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}><SlidersHorizontal size={16} /> Filters</button></div>
    {filtersOpen && <div className="image-filter-strip">{(Object.keys(filterOptions) as FilterKey[]).map((key) => <label key={key}>{key}<select aria-label={key} value={filters[key]} onChange={(event) => chooseFilter(key, event.target.value)}><option value="">Any</option>{filterOptions[key].map((option) => <option key={option} value={option}>{option}</option>)}</select></label>)}</div>}
    {loading && <div className="image-gallery-skeletons" aria-label="Loading image references">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div>}
    {error && <div className="image-gallery-state"><p>{error}</p><button type="button" onClick={() => setFilters({ ...filters })}>Try again</button></div>}
    {!loading && !error && results.length === 0 && <div className="image-gallery-state"><p>No image references found for this search.</p></div>}
    {!loading && !error && results.length > 0 && <><p className="image-result-count">{results.length} image references</p><div className="image-masonry-grid">{results.map((image) => <article className="image-reference-card" key={`${image.imageUrl}-${image.sourceUrl}`}><button type="button" aria-label={`Open ${image.title}`} onClick={() => { setSelected(image); setCollectionSaved(false); }}><img src={image.thumbnail} alt={image.title} loading="lazy" /></button><div><strong>{image.title}</strong><span>{image.source}</span><small>{image.license ?? 'License not provided'} · Open licensed reference</small></div></article>)}</div></>}
    {selected && <div className="image-preview-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><div className="image-preview-modal" role="dialog" aria-modal="true" aria-label={selected.title}><button className="image-preview-close" type="button" aria-label="Close preview" onClick={() => setSelected(null)}><X /></button><img src={selected.imageUrl} alt={selected.title} /><div className="image-preview-copy"><p className="eyebrow">{selected.source}</p><h2>{selected.title}</h2><p>{selected.license ?? 'License not provided'} · Preserve the original creator and source when saving.</p><div className="image-preview-actions"><Link to={`/references/add?url=${encodeURIComponent(selected.sourceUrl)}`}><Bookmark size={16} /> Save Reference</Link><a href={selected.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /> View Original</a><button type="button" onClick={() => setCollectionSaved(true)}><Bookmark size={16} /> {collectionSaved ? 'Added to Collection' : 'Add to Collection'}</button><Link to="/build-practice">Start Practice</Link></div></div></div></div>}
  </section>;
}