import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { CategoryPicker } from '../components/CategoryPicker';
import { SessionPreparation } from '../components/SessionPreparation';
import { categories, challenge, currentLesson } from '../data/atelier-data';
import type { ArtCategory } from '../types/content';

const moods = {
  Observe: 'Find the quietest shift in the light.',
  Loosen: 'Let the first lines stay visible.',
  Layer: 'Build colour like a small weather system.',
} as const;

type PracticeMood = keyof typeof moods;

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ArtCategory | null>(null);
  const [practiceMood, setPracticeMood] = useState<PracticeMood>('Observe');
  const [authName] = useState(() => {
    try {
      const stored = window.localStorage.getItem('atelier-auth-user');
      return stored ? (JSON.parse(stored) as { name?: string }).name ?? '' : '';
    } catch {
      return '';
    }
  });

  return <>
    <AppShell>
      <section className="cinema-hero">
        <div className="cinema-hero-copy">
          {authName && <p className="cinema-kicker">Welcome, {authName}</p>}
          <p className="cinema-kicker"><i /> Your practice room is open</p>
          <h1>Make a <em>mark.</em><br />See where it takes you.</h1>
          <p className="cinema-lede">A living studio for artists who want less scrolling and more time with the work.</p>
          <div className="cinema-actions">
            <Link className="cinema-primary" to="/build-practice">Build my practice <span>↗</span></Link>
            <Link className="cinema-link" to="/explore">Find a reference <span>→</span></Link>
          </div>
          <div className="tempo-picker" aria-label="Choose a studio prompt">
            <div>{(Object.keys(moods) as PracticeMood[]).map((mood) => <button key={mood} aria-pressed={practiceMood === mood} className={practiceMood === mood ? 'active' : ''} onClick={() => setPracticeMood(mood)}>{mood}</button>)}</div>
            <p>{moods[practiceMood]}</p>
          </div>
        </div>
        <figure className="cinema-hero-art">
          <img src="/images/atelier-paint-reveal-hero.png" alt="An artist laying a multicolour paint stroke across a studio canvas" />
          <figcaption><span>Today’s material</span><strong>Oil, pigment &amp; a little nerve</strong></figcaption>
          <svg className="hero-brush-line" viewBox="0 0 800 180" aria-hidden="true"><path d="M-20 150C126 68 229 206 383 109c153-97 252 6 455-94" /></svg>
        </figure>
      </section>
      {selectedCategory && <SessionPreparation category={selectedCategory} onClose={() => setSelectedCategory(null)} />}
      <section className="studio-strip" aria-label="Continue your practice"><p><span>In progress</span><strong>{currentLesson.title}</strong></p><div className="studio-progress" aria-label="62 percent complete"><i /></div><button onClick={() => setSelectedCategory(categories[0])}>Resume <span>→</span></button></section>
      <section className="cinema-subjects" id="subjects"><header><p className="cinema-kicker"><i /> Pick a direction</p><h2>What wants your attention?</h2><span>12 subjects · no endless feed</span></header><CategoryPicker categories={categories} onSelect={setSelectedCategory} /></section>
      <section className="studio-feature"><div className="studio-feature-copy"><p className="cinema-kicker"><i /> Today’s brief</p><h2>{challenge.title}</h2><p>{challenge.description}</p><Link className="cinema-primary" to="/challenge">Take the challenge <span>↗</span></Link></div><div className="studio-feature-image"><img src={challenge.imageUrl} alt="Gesture study of a resting figure" /><p>20 minute study<br /><strong>Draw the pause</strong></p></div></section>
      <footer className="cinema-footer"><Link className="wordmark" to="/">atelier<span>·</span></Link><p>For the hours that belong to your work.</p><span>© 2026</span></footer>
    </AppShell>
  </>;
}
