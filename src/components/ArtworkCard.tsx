import { useState } from 'react';
import type { Artwork } from '../types/content';

type Props = { artwork: Artwork; ratio?: 'portrait' | 'landscape' | 'square' };

export function ArtworkCard({ artwork, ratio = 'portrait' }: Props) {
  const [saved, setSaved] = useState(Boolean(artwork.saved));
  return <article className={`artwork-card ${ratio}`}>
    <div className="artwork-image-wrap"><img src={artwork.imageUrl} alt={artwork.alt} loading="lazy" />
      <button className="save-button" onClick={() => setSaved((value) => !value)} aria-label={`${saved ? 'Unsave' : 'Save'} ${artwork.title}`} aria-pressed={saved}>{saved ? '♥' : '♡'}</button>
    </div>
    <div className="artwork-meta"><h3>{artwork.title}</h3><p>{artwork.artist} <span>·</span> {artwork.medium}</p></div>
  </article>;
}
