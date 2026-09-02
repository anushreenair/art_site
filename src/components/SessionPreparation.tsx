import type { ArtCategory } from '../types/content';

type Props = { category: ArtCategory; onClose: () => void };

export function SessionPreparation({ category, onClose }: Props) {
  return <aside className="session-panel" aria-live="polite">
    <div className="session-panel-copy"><p className="eyebrow">Your next practice session</p><h2>{category.label}, with intention.</h2><p>Set a timer, find one clear reference, and give yourself permission to make a first imperfect mark.</p></div>
    <div className="session-panel-actions"><button className="button button-dark" onClick={onClose}>Begin {category.label} practice <span>↗</span></button><button className="text-button" onClick={onClose}>Not now</button></div>
  </aside>;
}
