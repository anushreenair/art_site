import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';

const categories = [
  { label: 'Proportion', then: 'Searching for landmarks', now: 'Clearer structural relationships', strength: 74 },
  { label: 'Values', then: 'Light and shadow competed', now: 'Your strongest organising tool', strength: 91 },
  { label: 'Colour', then: 'Local colour led the decisions', now: 'Temperature shifts support the light', strength: 77 },
  { label: 'Lighting', then: 'Highlights arrived too early', now: 'Light now turns the form', strength: 83 },
  { label: 'Perspective', then: 'The eye line drifted', now: 'Space feels steadier and calmer', strength: 68 },
  { label: 'Composition', then: 'Every area asked for attention', now: 'The focal point has room to breathe', strength: 80 },
];

export function BeforeAfterPage() {
  const [slider, setSlider] = useState(50);
  return <AppShell><section className="before-after-hero"><p className="eyebrow">Before & after progress</p><h1 aria-label="Your work, over time">Your work,<br /><em>over time.</em></h1><p>No rankings. No other artists. Just a quieter way to see what your own practice has changed.</p></section><section className="before-after-stage"><header><div><p className="eyebrow">Portrait practice · 39 studies apart</p><h2>My First Portrait <span>→</span> My 40th Portrait</h2></div><Link to="/journal">Read the practice journal ↗</Link></header><section className="before-after-canvas" aria-label="Personal artwork comparison" data-progress={slider}><figure className="older-work"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85" alt="My First Portrait" /><figcaption><span>Then</span><strong>My First Portrait</strong><small>January 2025 · Pencil</small></figcaption></figure><figure className="newer-work" style={{ clipPath: `inset(0 ${100 - slider}% 0 0)` }}><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85" alt="My 40th Portrait" /><figcaption><span>Now</span><strong>My 40th Portrait</strong><small>September 2026 · Watercolour</small></figcaption></figure><i style={{ left: `${slider}%` }} aria-hidden="true" /></section><label className="before-after-slider">Reveal newer work<input aria-label="Personal progress comparison" type="range" min="0" max="100" value={slider} onChange={(event) => setSlider(Number(event.target.value))} /></label></section><section className="personal-observation"><div><p className="eyebrow">What your record shows</p><h2>Values used to be your weakest area. They are now one of your strongest.</h2></div><p>That change came from short studies, repeated value checks, and a willingness to simplify. Keep using that same patience as you return to perspective.</p></section><section className="progress-categories"><header><p className="eyebrow">Personal improvement map</p><h2>Compare decisions, not worth.</h2></header><div>{categories.map((category) => <article key={category.label}><div><strong>{category.label}</strong><span>{category.strength}% confident</span></div><p><small>Earlier</small>{category.then}</p><p><small>Now</small>{category.now}</p><i><b style={{ width: `${category.strength}%` }} /></i></article>)}</div></section></AppShell>;
}
