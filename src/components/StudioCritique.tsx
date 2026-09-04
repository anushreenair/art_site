import { getStudioCritique } from '../lib/studioCritique';
import type { ReferenceStudy } from '../types/content';

export function StudioCritique({ study }: { study: ReferenceStudy }) {
  const critique = getStudioCritique(study);
  return <section className="studio-critique" aria-label="Studio critique"><header><p className="eyebrow">Studio critic</p><p>This is a guide for your next pass, not a final judgement or a grade.</p></header><div className="critique-sections"><section><h2>What worked well</h2><p>{critique.worked}</p></section><section><h2>What could improve</h2><p>{critique.improve}</p></section><section><h2>Three things to practise next</h2><ol>{critique.next.map((item) => <li key={item}>{item}</li>)}</ol></section><section><h2>One suggested next exercise</h2><p>{critique.exercise}</p></section></div><footer><span>Observation lenses</span>{critique.lenses.map((lens) => <i key={lens}>{lens}</i>)}</footer></section>;
}
