import { useState } from 'react';

export const critiqueFocusAreas = ['Everything', 'Proportion', 'Anatomy', 'Lighting', 'Colour', 'Values', 'Composition', 'Perspective', 'Technique', 'Accuracy to Reference', 'Brushwork'] as const;
export const critiqueTones = ['Encouraging', 'Balanced', 'Direct'] as const;
export type CritiqueFocusArea = (typeof critiqueFocusAreas)[number];
export type CritiqueTone = (typeof critiqueTones)[number];
export type CritiqueIntentSelection = { areas: CritiqueFocusArea[]; tone: CritiqueTone };

export function CritiqueIntent({ target, onClose, onContinue }: { target: 'AI Critique' | 'Community Critique'; onClose: () => void; onContinue: (selection: CritiqueIntentSelection) => void }) {
  const [areas, setAreas] = useState<CritiqueFocusArea[]>(['Everything']);
  const [tone, setTone] = useState<CritiqueTone>('Balanced');
  const chooseArea = (area: CritiqueFocusArea) => setAreas((current) => {
    if (area === 'Everything') return ['Everything'];
    const withoutEverything = current.filter((item) => item !== 'Everything');
    const next = withoutEverything.includes(area) ? withoutEverything.filter((item) => item !== area) : [...withoutEverything, area];
    return next.length ? next : ['Everything'];
  });

  return <div className="critique-intent-backdrop" role="presentation" onMouseDown={onClose}><section className="critique-intent" role="dialog" aria-modal="true" aria-labelledby="critique-intent-title" onMouseDown={(event) => event.stopPropagation()}><button className="critique-intent-close" aria-label="Close critique preferences" onClick={onClose}>×</button><header><p className="eyebrow">Critique with intent</p><h2 id="critique-intent-title">What would you like feedback on?</h2><p>Choose the decisions that would genuinely help you move the work forward.</p></header><fieldset><legend>Focus areas</legend><div className="critique-focus-options">{critiqueFocusAreas.map((area) => <button key={area} type="button" aria-pressed={areas.includes(area)} className={areas.includes(area) ? 'selected' : ''} onClick={() => chooseArea(area)}>{area}</button>)}</div></fieldset><fieldset><legend>How would you like feedback?</legend><div className="critique-tone-options">{critiqueTones.map((option) => <button key={option} type="button" aria-pressed={tone === option} className={tone === option ? 'selected' : ''} onClick={() => setTone(option)}>{option}</button>)}</div></fieldset><footer><p>{target === 'Community Critique' ? 'Community critics will see this brief and keep their feedback within it.' : 'The critic will use this as a lens, not as a final judgement.'}</p><button aria-label={`Continue to ${target}`} onClick={() => onContinue({ areas, tone })}>Continue to {target} <span>↗</span></button></footer></section></div>;
}
