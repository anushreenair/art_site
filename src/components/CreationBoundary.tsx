import { useState } from 'react';
import { Link } from 'react-router-dom';

type CreationBoundaryProps = {
  startTo: string;
  onShowMore?: () => void;
};

export function CreationBoundary({ startTo, onShowMore }: CreationBoundaryProps) {
  const [saved, setSaved] = useState(false);

  return <section className="creation-boundary" aria-label="Creation boundary">
    <div><p className="eyebrow">Make the next mark</p><h2>You&apos;ve found enough inspiration.</h2><p>Choose one and start creating.</p></div>
    <div className="creation-boundary__actions"><Link aria-label="Start Practice" className="button button-dark" to={startTo}>Start Practice <span>↗</span></Link>{onShowMore && <button onClick={onShowMore}>Show Me 5 More</button>}<button aria-pressed={saved} onClick={() => setSaved((value) => !value)}>{saved ? 'Saved For Later' : 'Save For Later'}</button></div>
  </section>;
}
