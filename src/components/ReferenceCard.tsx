import { useState } from 'react';
import type { ReferenceStudy } from '../types/content';

type Props = { study: ReferenceStudy; onStart: (study: ReferenceStudy) => void };

export function ReferenceCard({ study, onStart }: Props) {
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  return <article className="reference-card">
    <div className="reference-image"><img src={study.imageUrl} alt={study.alt} loading="lazy" /><span className="rights-badge">{study.rights}</span></div>
    <div className="reference-content"><div className="reference-topline"><span>{study.subject}</span><span>{study.difficulty}</span></div><h2>{study.title}</h2><p className="reference-medium">{study.medium} <span>·</span> {study.time}</p><ul className="skill-list" aria-label="Skills practised">{study.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul><p className="attempts">{study.attempts.toLocaleString()} artists attempted this</p><div className="reference-actions"><button className="button button-dark" onClick={() => onStart(study)}>Start Practice <span>↗</span></button><button className="icon-action" aria-label={`${saved ? 'Unsave' : 'Save'} ${study.title}`} aria-pressed={saved} onClick={() => setSaved((value) => !value)}>{saved ? '♥' : '♡'}</button><button className="icon-action" aria-label={`Add ${study.title} to Collection`} aria-expanded={collectionsOpen} onClick={() => setCollectionsOpen((value) => !value)}>＋</button><button className="preview-action" aria-label={`Preview ${study.title}`} onClick={() => setPreviewOpen(true)}>Preview</button></div>{collectionsOpen && <div className="collection-menu" role="menu"><button role="menuitem">Figure studies</button><button role="menuitem">Weekend palette</button><button role="menuitem">New collection</button></div>}</div>
    {previewOpen && <div className="preview-backdrop" role="presentation" onMouseDown={() => setPreviewOpen(false)}><section className="study-preview" role="dialog" aria-modal="true" aria-label={study.title} onMouseDown={(event) => event.stopPropagation()}><button className="dialog-close" aria-label="Close preview" onClick={() => setPreviewOpen(false)}>×</button><img src={study.imageUrl} alt={study.alt} /><div><p className="eyebrow">{study.subject} · {study.difficulty}</p><h2>{study.title}</h2><p>{study.medium} · {study.time}</p><p>Practise {study.skills.join(', ').toLowerCase()} with this focused reference.</p><button className="button button-dark" onClick={() => onStart(study)}>Start Practice <span>↗</span></button></div></section></div>}
  </article>;
}
