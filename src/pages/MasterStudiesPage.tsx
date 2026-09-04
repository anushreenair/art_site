import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { masterStudies, type MasterStudy } from '../data/master-studies';

export function MasterStudiesPage() {
  const [selectedId, setSelectedId] = useState('vermeer-pearl');
  const selected = masterStudies.find((study) => study.id === selectedId) ?? masterStudies[0];

  return <AppShell>
    <section className="masters-hero"><div><p className="eyebrow">Master studies / public-domain works</p><h1 aria-label="Master studies">Study the<br /><em>decisions.</em></h1><p>Borrow a master’s questions—how the light is held, where an edge disappears, why one shape matters more than another—then carry them into your own practice.</p></div><div className="masters-principle"><span>Not copying</span><strong>Look for the choice beneath the mark.</strong></div></section>
    <section className="master-select" aria-label="Public-domain master artworks"><header><div><p className="eyebrow">Choose an original</p><h2>Three paintings, many decisions.</h2></div><p>All works shown here are public domain.</p></header><div>{masterStudies.map((study) => <MasterButton key={study.id} study={study} selected={study.id === selectedId} onSelect={() => setSelectedId(study.id)} />)}</div></section>
    <section className="master-study" aria-label={`${selected.title} study`}><div className="master-original"><img src={selected.image} alt={selected.alt} /><span>{selected.movement}</span></div><div className="master-meta"><p className="eyebrow">The original</p><h2>{selected.title}</h2><p className="master-artist">{selected.artist} · {selected.year}</p><p className="master-medium">{selected.medium}</p><p>Use this original as a field of decisions. The goal is not a faithful copy—it is noticing what makes the image work.</p></div><div className="master-analysis"><p className="eyebrow">What to look for</p>{selected.analysis.map((item) => <article key={item.label}><h3>{item.label}</h3><p>{item.note}</p></article>)}</div><div className="master-activities"><header><div><p className="eyebrow">Practice activities</p><h2>Take one decision to the page.</h2></div><p>Short studies make room for looking again.</p></header>{selected.activities.map((activity, index) => <article key={activity.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{activity.title}</h3><p>{activity.note}</p></div><small>{activity.duration}</small><Link to={`/practice/${activity.studyId}`}>{activity.title === '15-Minute Value Study' ? '15-Minute Value Study' : 'Start practice'} <b>↗</b></Link></article>)}</div></section>
  </AppShell>;
}

function MasterButton({ study, selected, onSelect }: { study: MasterStudy; selected: boolean; onSelect: () => void }) {
  return <button className={selected ? 'selected' : ''} aria-pressed={selected} onClick={onSelect}><img src={study.image} alt="" /><span>{study.artist}</span><strong>{study.title}</strong><small>{study.year}</small></button>;
}
