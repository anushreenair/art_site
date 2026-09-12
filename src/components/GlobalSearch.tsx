import { Mic, Search, Square, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSearchSuggestions } from '../lib/search';
import { clearSearchHistory, personalSuggestions, recentSearches, rememberSearch } from '../lib/search/history';
import { useVoiceSearch } from './useVoiceSearch';

export function GlobalSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('q') ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [history, setHistory] = useState<string[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const voice = useVoiceSearch(setQuery, submit);
  useEffect(() => { setQuery(new URLSearchParams(location.search).get('q') ?? ''); setOpen(false); setActive(-1); }, [location.search, location.pathname]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  const groups = query.trim()
    ? [{ label: 'Suggested searches', items: getSearchSuggestions(query) }]
    : [{ label: 'Recent Searches', items: history }, { label: 'Trending Searches', items: getSearchSuggestions('') }, { label: 'Suggested For You', items: personalSuggestions(history) }];
  const options = groups.flatMap(group => group.items);
  function submit(value = query) {
    const text = value.trim().slice(0, 500);
    if (!text) return;
    voice.cancel();
    setHistory(rememberSearch(text));
    setQuery(text); setOpen(false); setActive(-1);
    navigate(`/search?${new URLSearchParams({ q: text })}`);
  }
  function show() { setHistory(recentSearches()); setOpen(true); }
  let index = 0;
  return <div className="global-search" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); setActive(-1); voice.cancel(); input.current?.focus(); } }}>
    <form className="global-search-form" role="search" onSubmit={event => { event.preventDefault(); submit(open && active >= 0 ? options[active] : query); }}>
      <button type="submit" aria-label="Search"><Search size={19} aria-hidden="true" /></button>
      <input ref={input} value={query} maxLength={500} type="search" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={open ? `${id}-suggestions` : undefined} aria-activedescendant={open && active >= 0 ? `${id}-${active}` : undefined} autoComplete="off" aria-label="Search Atelier" placeholder="Search what you want to draw, paint or learn…"
        onChange={event => { setQuery(event.target.value); setOpen(true); setActive(-1); }} onFocus={show}
        onKeyDown={event => { if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && options.length) { event.preventDefault(); setOpen(true); setActive(value => (value + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length); } }} />
      {query && <button className="global-search-clear" type="button" aria-label="Clear search" onClick={() => { setQuery(''); setActive(-1); show(); input.current?.focus(); }}><X size={17} /></button>}
      {voice.supported && <button className={`global-search-voice${voice.listening ? ' listening' : ''}`} type="button" aria-label={voice.listening ? 'Stop listening' : 'Search by voice'} title="Your browser may use its speech service to transcribe audio." aria-pressed={voice.listening} onClick={voice.toggle}>{voice.listening ? <Square size={17} /> : <Mic size={18} />}</button>}
    </form>
    {(voice.listening || voice.message) && <p className="global-search-error" role="status">{voice.listening ? 'Listening… Click the microphone to stop.' : voice.message}</p>}
    {open && <div className="global-search-suggestions">
      <div role="listbox" id={`${id}-suggestions`} aria-label="Search suggestions">
        {groups.filter(group => group.items.length).map(group => <div role="group" aria-label={group.label} key={group.label}><p className="global-search-label">{group.label}{group.label === 'Trending Searches' && <small> · Curated inspiration</small>}</p>{group.items.map(item => { const optionIndex = index++; return <div key={`${group.label}-${item}`} id={`${id}-${optionIndex}`} role="option" aria-selected={active === optionIndex} className="search-suggestion-option" onPointerDown={event => event.preventDefault()} onClick={() => submit(item)}>{item}</div>; })}</div>)}
      </div>
      {!options.length && <p className="global-search-label">Press Enter to search for “{query}”</p>}
      <div className="search-suggestion-footer">{history.length > 0 && <button type="button" onClick={() => { clearSearchHistory(); setHistory([]); }}>Clear history</button>}<Link to="/search" onClick={() => setOpen(false)}>Explore search ↗</Link><button type="button" onClick={() => setOpen(false)}>Close</button></div>
    </div>}
  </div>;
}
