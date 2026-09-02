import type { Opportunity, Practice } from '../types/content';

export function PracticeCard({ practice, label = 'Recommended practice' }: { practice: Practice; label?: string }) {
  return <article className="practice-card"><img src={practice.imageUrl} alt="" loading="lazy" /><div><p className="eyebrow">{label}</p><h3>{practice.title}</h3><p>{practice.description}</p><footer><span>{practice.duration}</span><span>{practice.level}</span></footer></div></article>;
}

export function LearningProgress({ practice }: { practice: Practice }) {
  return <article className="learning-card"><div><p className="eyebrow">Continue learning</p><h2>{practice.title}</h2><p>{practice.description}</p><div className="progress-row"><span>Lesson 07 of 12</span><span>62%</span></div><div className="progress-track"><i /></div><button className="text-link">Resume lesson <span>→</span></button></div><img src={practice.imageUrl} alt="A close detail of a charcoal portrait study" /></article>;
}

export function StreakCard() { return <article className="streak-card"><p className="eyebrow">Practice streak</p><strong>08</strong><div><h3>gentle days in a row</h3><p>Keep the pencil moving. One small study is enough today.</p></div><span className="streak-spark">✦</span></article>; }

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) { return <article className="opportunity-card"><p className="eyebrow">{opportunity.type}</p><h3>{opportunity.title}</h3><p>{opportunity.organisation}</p><footer><span>{opportunity.date}</span><span>{opportunity.location}</span></footer><button className="text-link">View opportunity <span>↗</span></button></article>; }
