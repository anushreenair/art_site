import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { portraitReferencePack } from '../data/reference-packs';

export function ReferencePacksPage() {
  const [activeId, setActiveId] = useState('front');
  const activeView = portraitReferencePack.find((view) => view.id === activeId) ?? portraitReferencePack[0];

  return <AppShell><main className="reference-packs">
    <section className="pack-intro">
      <div><p className="eyebrow">Connected reference study</p><h1 aria-label="Portrait Reference Pack">Portrait<br /><em>Reference Pack.</em></h1></div>
      <p>One portrait, seen from the angles and study modes that make the structure easier to understand. Build knowledge—not a copy of one photograph.</p>
    </section>

    <section className="pack-studio" aria-labelledby="pack-studio-title">
      <header><div><p className="eyebrow">A complete working set</p><h2 id="pack-studio-title">Choose one view. Notice what it teaches.</h2></div><span>10 connected studies</span></header>
      <div className="pack-layout">
        <nav className="pack-view-list" aria-label="Portrait reference views">{portraitReferencePack.map((view, index) => <button key={view.id} aria-label={view.label} onClick={() => setActiveId(view.id)} aria-pressed={activeId === view.id}><small aria-hidden="true">{String(index + 1).padStart(2, '0')}</small><span>{view.label}</span></button>)}</nav>
        <figure className={`pack-active-view ${activeView.id === 'gray' || activeView.id === 'value' ? 'monochrome' : ''}`}><img src={activeView.image} alt={activeView.alt} /><figcaption><p className="eyebrow">{activeView.label}</p><h3>{activeView.study}</h3><p>{activeView.insight}</p></figcaption></figure>
        <aside className="pack-note"><span className="pack-orbit">◌</span><p className="eyebrow">Study prompt</p><p>Stay with this view for 10 minutes. Describe the big shapes before you make marks.</p><div><span>Pack: Portrait</span><span>Level: All levels</span></div></aside>
      </div>
    </section>

    <section className="pack-handoff"><div><p className="eyebrow">When you are ready</p><h2>Take one lesson to the easel.</h2><p>The pack is there to make your next decision clearer—not to keep you looking longer.</p></div><Link className="button button-dark" to="/practice/ref-portrait">Start portrait practice <span>↗</span></Link></section>
  </main></AppShell>;
}
