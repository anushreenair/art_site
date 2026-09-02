import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ArtworkCard } from '../components/ArtworkCard';
import { CategoryPicker } from '../components/CategoryPicker';
import { ArtStory } from '../components/ArtStory';
import { SessionPreparation } from '../components/SessionPreparation';
import { artworks, categories, challenge, currentLesson } from '../data/atelier-data';
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

  return <>
    <ArtStory />
    <AppShell>
      <section className="cinema-hero">
        <div className="cinema-hero-copy">
          <p className="cinema-kicker"><i /> Your practice room is open</p>
          <h1>Make a <em>mark.</em><br />See where it takes you.</h1>
          <p className="cinema-lede">A living studio for artists who want less scrolling and more time with the work.</p>
          <div className="cinema-actions">
            <button className="cinema-primary" onClick={() => setSelectedCategory(categories[0])}>Start a practice <span>↗</span></button>
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
      <section className="studio-feature"><div className="studio-feature-copy"><p className="cinema-kicker"><i /> Today’s brief</p><h2>{challenge.title}</h2><p>{challenge.description}</p><button className="cinema-primary" onClick={() => setSelectedCategory(categories[7])}>Take the challenge <span>↗</span></button></div><div className="studio-feature-image"><img src={challenge.imageUrl} alt="Gesture study of a resting figure" /><p>20 minute study<br /><strong>Draw the pause</strong></p></div></section>
      <section className="studio-wall"><header><p className="cinema-kicker"><i /> Fresh from the studio</p><h2>Make looking part of the practice.</h2><Link to="/explore">Explore the reference desk <span>→</span></Link></header><div>{artworks.slice(0, 4).map((artwork, index) => <ArtworkCard key={artwork.id} artwork={artwork} ratio={index === 1 ? 'landscape' : 'portrait'} />)}</div></section>
      <footer className="cinema-footer"><Link className="wordmark" to="/">atelier<span>·</span></Link><p>For the hours that belong to your work.</p><span>© 2026</span></footer>
    </AppShell>
  </>;
}
