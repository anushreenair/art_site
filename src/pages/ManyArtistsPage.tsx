import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';

type Interpretation = { title: string; artist: string; medium: string; approach: string; level: string; image: string; alt: string };
const interpretations: Interpretation[] = [
  { title: 'Soft window, watercolour', artist: 'Maya Chen', medium: 'Watercolour', approach: 'Loose painting', level: 'Beginner attempt', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85', alt: 'Watercolour portrait study' },
  { title: 'Held in amber', artist: 'Nora Vale', medium: 'Oil', approach: 'Realistic painting', level: 'Advanced attempt', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85', alt: 'Oil portrait study' },
  { title: 'Acrylic morning', artist: 'Kavi Shah', medium: 'Acrylic', approach: 'Loose painting', level: 'Intermediate attempt', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85', alt: 'Acrylic portrait study' },
  { title: 'Gouache hush', artist: 'Elena Sol', medium: 'Gouache', approach: 'Graphic study', level: 'Intermediate attempt', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85', alt: 'Gouache portrait study' },
  { title: 'Memory in charcoal', artist: 'Diego Rios', medium: 'Charcoal', approach: 'Value study', level: 'Beginner attempt', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85', alt: 'Charcoal portrait study' },
  { title: 'Line and light', artist: 'Sora Lee', medium: 'Pencil', approach: 'Realistic drawing', level: 'Advanced attempt', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85', alt: 'Pencil portrait study' },
];
const filters = ['All', 'Watercolour', 'Oil', 'Acrylic', 'Gouache', 'Charcoal', 'Pencil'] as const;
type Filter = typeof filters[number];

export function ManyArtistsPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const visible = filter === 'All' ? interpretations : interpretations.filter((item) => item.medium === filter);
  return <AppShell><section className="many-hero"><p className="eyebrow">Shared reference studio</p><h1 aria-label="One reference, many artists">One reference,<br /><em>many artists.</em></h1><p>One image can lead to a hundred honest decisions. There is no single correct outcome—only attention, intention, and practice.</p></section><section className="many-reference"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85" alt="Window-light portrait reference" /><div><p className="eyebrow">The shared reference</p><h2>Window-light portrait</h2><p>20-minute portrait study · Personal Practice Only</p><Link to="/practice/ref-portrait">Open the reference ↗</Link></div><aside><strong>01</strong><span>Reference</span><i>→</i><strong>{interpretations.length}</strong><span>Interpretations</span></aside></section><section className="many-gallery"><header><div><p className="eyebrow">Different hands, different answers</p><h2>What artists made from the same starting point.</h2></div><div className="many-filters" aria-label="Filter interpretations by medium">{filters.map((option) => <button key={option} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}</div></header><div className="interpretation-grid">{visible.map((item, index) => <article key={item.title} className={index === 1 ? 'tall' : ''}><img src={item.image} alt={item.alt} /><div><p>{item.medium} · {item.approach}</p><h3>{item.title}</h3><span>{item.artist}</span><small>{item.level}</small></div></article>)}</div></section><section className="many-principle"><p className="eyebrow">The point of sharing</p><h2>Notice the choices—not who “did it best.”</h2><p>A soft watercolour edge, a bold charcoal mass, and a careful oil study can each be a true response to the same light.</p><Link to="/community">See more thoughtful practice in Community ↗</Link></section></AppShell>;
}
