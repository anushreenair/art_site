import { useEffect, useState } from 'react';

const revealDuration = 4600;

export function PaintReveal() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(false), revealDuration);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return <section className="paint-reveal" role="dialog" aria-modal="true" aria-label="Atelier opening">
    <img src="/images/atelier-paint-reveal-hero.png" alt="Artist sweeping a paintbrush through vivid pigment" />
    <div className="paint-reveal-ink" aria-hidden="true" />
    <div className="paint-reveal-brush" data-testid="brush-sweep" aria-hidden="true"><i className="brush-handle" /><i className="brush-ferrule" /><i className="brush-bristles" /></div>
    <div className="paint-reveal-sweep paint-reveal-sweep-one" aria-hidden="true" />
    <div className="paint-reveal-sweep paint-reveal-sweep-two" aria-hidden="true" />
    <div className="paint-reveal-splash paint-reveal-splash-one" aria-hidden="true" />
    <div className="paint-reveal-splash paint-reveal-splash-two" aria-hidden="true" />
    <div className="paint-reveal-copy"><span>atelier · practice room</span><p>Every studio begins with a mark.</p></div>
    <button className="paint-reveal-enter" onClick={() => setIsVisible(false)}>Enter the studio <span>↗</span></button>
  </section>;
}
