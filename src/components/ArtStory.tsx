import { useEffect, useState } from 'react';

const scenes = [
  { id: 'first', label: '01 · First marks', title: 'Every artist begins with a mark.', copy: 'Two small brushes. A wide open page. The joy of seeing colour become something new.', image: '/images/story/first-marks.jpeg', alt: 'Children holding paintbrushes and standing beside a paint bucket' },
  { id: 'voice', label: '02 · Find your voice', title: 'Then the work begins to sound like you.', copy: 'A growing eye notices colour, shape, and a world worth translating into paint.', image: '/images/story/find-your-voice.jpeg', alt: 'Teen artists painting together in a sunlit studio' },
  { id: 'practice', label: '03 · Keep making', title: 'Practice becomes a way of seeing.', copy: 'Years later, the same curiosity meets craft, patience, and a room of one’s own.', image: '/images/story/the-practice.jpeg', alt: 'Adult artist painting at an easel in a warm studio' },
] as const;

export function ArtStory() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const scene = scenes[sceneIndex];

  useEffect(() => {
    const timer = window.setInterval(() => setSceneIndex((current) => (current + 1) % scenes.length), 3600);
    return () => window.clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return <section className={`art-story ${scene.id}`} role="dialog" aria-modal="true" aria-label="The Atelier story">
    <div className="art-story-noise" aria-hidden="true" />
    <div className="art-story-orb" aria-hidden="true" />
    <div className="art-story-stroke art-story-stroke-one" aria-hidden="true" />
    <div className="art-story-stroke art-story-stroke-two" aria-hidden="true" />
    <div className="art-story-top"><span>atelier / a practice story</span><span>{scene.label}</span></div>
    <div className="art-story-copy"><p>Make the work. Keep the wonder.</p><h2>{scene.title}</h2><p className="art-story-lede">{scene.copy}</p></div>
    <figure className="art-story-frame"><img key={scene.id} src={scene.image} alt={scene.alt} /><figcaption>Made in the moment <i /></figcaption></figure>
    <div className="art-story-bottom"><div className="art-story-nav" aria-label="Story chapters">{scenes.map((chapter, index) => <button key={chapter.id} className={index === sceneIndex ? 'active' : ''} aria-label={`Show ${chapter.label}`} aria-pressed={index === sceneIndex} onClick={() => setSceneIndex(index)}><i /><span>{chapter.label}</span></button>)}</div><button className="art-story-enter" onClick={() => setIsVisible(false)}>Enter Atelier <span>↗</span></button></div>
  </section>;
}
