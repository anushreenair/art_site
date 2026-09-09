import { getStudioCritique } from '../lib/studioCritique';
import type { CritiqueIntentSelection } from './CritiqueIntent';
import type { ReferenceStudy } from '../types/content';

export function StudioCritique({ study, intent }: { study: ReferenceStudy; intent?: CritiqueIntentSelection | null }) {
  const critique = getStudioCritique(study);
  const lenses = intent && !intent.areas.includes('Everything') ? intent.areas : critique.lenses;
  return <section className="studio-critique" aria-label="Studio critique"><header><div><p className="eyebrow">Studio critic</p>{intent && <p className="critique-intent-summary">Requested focus: {intent.areas.join(' + ')} · {intent.tone}</p>}</div><p>This is a guide for your next pass, not a final judgement or a grade.</p></header><div className="critique-sections"><section><h2>What worked well</h2><p>{critique.worked}</p></section><section><h2>What could improve</h2><p>{critique.improve}</p></section><section><h2>Three things to practise next</h2><ol>{critique.next.map((item) => <li key={item}>{item}</li>)}</ol></section><section><h2>One suggested next exercise</h2><p>{critique.exercise}</p></section></div><footer><span>Observation lenses</span>{lenses.map((lens) => <i key={lens}>{lens}</i>)}</footer></section>;
}
