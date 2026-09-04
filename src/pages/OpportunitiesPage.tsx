import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { filterOpportunities, opportunityCities, opportunityListings, opportunityTabs, type ArtistOpportunity, type OpportunityTab } from '../data/opportunity-listings';

const emptyFilters = { city: '', format: '', medium: '', experience: '', cost: '', date: '', deadline: '', category: '', eligibility: '', age: '', prize: '', entryFee: '' };

export function OpportunitiesPage() {
  const [tab, setTab] = useState<OpportunityTab>('Nearby');
  const [filters, setFilters] = useState(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const visible = useMemo(() => filterOpportunities(opportunityListings, tab, filters), [filters, tab]);
  const updateFilter = (name: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [name]: value }));

  return <AppShell>
    <section className="opportunity-hero">
      <div>
        <p className="eyebrow">Opportunity desk / India + online</p>
        <h1>Opportu<em>nities</em></h1>
        <p>Find a room for the work—whether that is a local sketch walk, a funded studio, a commission, or a call that deserves the piece you have been making.</p>
      </div>
      <div className="opportunity-signal"><span>Right now</span><strong>{opportunityListings.filter((listing) => listing.closingSoon).length}</strong><small>deadlines to notice</small></div>
    </section>

    <section className="opportunity-browser" aria-label="Browse opportunities">
      <div className="opportunity-tabs" role="tablist" aria-label="Opportunity type">
        {opportunityTabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)}>{item}</button>)}
      </div>
      <div className="opportunity-controls">
        <label>City<select aria-label="City" value={filters.city} onChange={(event) => updateFilter('city', event.target.value)}><option value="">Everywhere</option>{opportunityCities.map((city) => <option key={city}>{city}</option>)}<option>Online</option></select></label>
        <label>Format<select value={filters.format} onChange={(event) => updateFilter('format', event.target.value)}><option value="">Online + offline</option><option>Offline</option><option>Online</option></select></label>
        <label>Cost<select value={filters.cost} onChange={(event) => updateFilter('cost', event.target.value)}><option value="">Paid + free</option><option>Free</option><option>Paid</option></select></label>
        <button className="filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>More filters <span>{filtersOpen ? '−' : '+'}</span></button>
        <button className="clear-filters" onClick={() => setFilters(emptyFilters)}>Clear</button>
      </div>
      {filtersOpen && <div className="opportunity-more-filters">
        <FilterSelect label="Date" value={filters.date} onChange={(value) => updateFilter('date', value)} options={['September', 'October', 'November']} />
        <FilterSelect label="Deadline" value={filters.deadline} onChange={(value) => updateFilter('deadline', value)} options={['Closing soon', 'This month']} />
        <FilterSelect label="Category" value={filters.category} onChange={(value) => updateFilter('category', value)} options={['Portrait', 'Architecture', 'Nature', 'Contemporary art']} />
        <FilterSelect label="Medium" value={filters.medium} onChange={(value) => updateFilter('medium', value)} options={['Watercolour', 'Oil Painting', 'Ink', 'Mixed Media', 'Gouache']} />
        <FilterSelect label="Eligibility" value={filters.eligibility} onChange={(value) => updateFilter('eligibility', value)} options={['Open to all artists', 'Indian residents', 'Artists based in India']} />
        <FilterSelect label="Experience level" value={filters.experience} onChange={(value) => updateFilter('experience', value)} options={['Beginner', 'Intermediate', 'Advanced', 'Emerging', 'Any level', 'Established']} />
        <FilterSelect label="Age" value={filters.age} onChange={(value) => updateFilter('age', value)} options={['16+', '18+', '21+']} />
        <FilterSelect label="Prize" value={filters.prize} onChange={(value) => updateFilter('prize', value)} options={['Has prize', 'No prize']} />
        <FilterSelect label="Entry fee" value={filters.entryFee} onChange={(value) => updateFilter('entryFee', value)} options={['Free', 'Entry fee']} />
      </div>}
      <div className="opportunity-list-heading"><p className="eyebrow">{tab}</p><span>{visible.length} opportunities</span></div>
      <div className="opportunity-list">{visible.length ? visible.map((listing, index) => <OpportunityRow key={listing.id} listing={listing} index={index + 1} />) : <div className="opportunity-empty"><h2>No calls in this combination.</h2><p>Try clearing a filter or choosing a different place to look.</p><button onClick={() => setFilters(emptyFilters)}>Show all {tab.toLowerCase()}</button></div>}</div>
    </section>

    <section className="opportunity-shelves">
      <OpportunityShelf title="Events near me" copy="A few reasons to take your sketchbook out this month." listings={opportunityListings.filter((listing) => listing.city === 'Bangalore' || listing.city === 'Hyderabad' || listing.city === 'Pune')} />
      <OpportunityShelf title="Closing soon" copy="Put these on the studio wall before their doors close." listings={opportunityListings.filter((listing) => listing.closingSoon)} tone="clay" />
      <OpportunityShelf title="Recommended for you" copy="Selected for a painter building a consistent practice." listings={opportunityListings.filter((listing) => listing.recommended)} />
      <OpportunityShelf title="Free opportunities" copy="No entry fee, just a clear reason to submit." listings={opportunityListings.filter((listing) => listing.entryFee === 'Free')} />
      <OpportunityShelf title="Online opportunities" copy="Calls and commissions that travel beyond your city." listings={opportunityListings.filter((listing) => listing.format === 'Online')} tone="ink" />
    </section>
  </AppShell>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label>{label}<select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Any</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function OpportunityRow({ listing, index }: { listing: ArtistOpportunity; index: number }) {
  return <article className="opportunity-slip">
    <span className="opportunity-index">{String(index).padStart(2, '0')}</span>
    <div className="opportunity-title"><p className="eyebrow">{listing.type} · {listing.format}</p><h2>{listing.name}</h2><p>{listing.city} · {listing.venue}</p></div>
    <dl><div><dt>Date</dt><dd>{listing.date}</dd></div><div><dt>Deadline</dt><dd>{listing.deadline}</dd></div><div><dt>Entry fee</dt><dd>{listing.entryFee}</dd></div><div><dt>Prize</dt><dd>{listing.prize}</dd></div></dl>
    <div className="opportunity-terms"><span>{listing.category} · {listing.medium}</span><span>{listing.eligibility} · {listing.age}</span><small>Official source · {listing.officialSource}</small></div>
    <button className="opportunity-apply" onClick={() => window.open('https://example.com', '_blank', 'noopener,noreferrer')}>{listing.action} <span>↗</span></button>
  </article>;
}

function OpportunityShelf({ title, copy, listings, tone = 'moss' }: { title: string; copy: string; listings: ArtistOpportunity[]; tone?: 'moss' | 'clay' | 'ink' }) {
  return <section className={`opportunity-shelf ${tone}`}><header><div><p className="eyebrow">A useful next step</p><h2>{title}</h2></div><p>{copy}</p></header><div>{listings.slice(0, 3).map((listing) => <article key={listing.id}><p>{listing.type} · {listing.city}</p><h3>{listing.name}</h3><span>{listing.deadline} · {listing.entryFee}</span></article>)}</div></section>;
}
