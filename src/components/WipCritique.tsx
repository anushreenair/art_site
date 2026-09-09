import { useState } from 'react';
import { CritiqueIntent, type CritiqueIntentSelection } from './CritiqueIntent';
import type { ReferenceStudy } from '../types/content';

const stages = ['Initial Sketch', 'Construction', 'Value Study', 'Colour Block-In', 'Midway', 'Refinement', 'Nearly Finished', 'Finished'] as const;
type Stage = (typeof stages)[number];

const stageGuidance: Record<Stage, { title: string; intro: string; focus: string[]; next: string }> = {
  'Initial Sketch': { title: 'Sketch check', intro: 'Keep the drawing structural. It is too early to judge finish.', focus: ['Proportion', 'Perspective', 'Placement', 'Composition'], next: 'Compare the widest and tallest relationships before adding detail.' },
  Construction: { title: 'Construction check', intro: 'Make the underlying forms do the work before rendering.', focus: ['Major angles', 'Center lines', 'Overlaps', 'Negative shapes'], next: 'Correct one large relationship, then redraw only that construction line.' },
  'Value Study': { title: 'Value check', intro: 'Judge the light family before colour or texture.', focus: ['Light direction', 'Shadow grouping', 'Value range', 'Focal contrast'], next: 'Squint until the subject reads in three value families.' },
  'Colour Block-In': { title: 'Colour block-in check', intro: 'Stay broad; colour needs a stable value structure.', focus: ['Temperature shifts', 'Value first', 'Large colour masses', 'Colour relationships'], next: 'Mix one quiet neutral to connect the two largest colour areas.' },
  Midway: { title: 'Midway check', intro: 'Protect the large decisions while beginning to edit.', focus: ['Hierarchy', 'Edge variety', 'Depth', 'Focal point'], next: 'Soften one non-focal edge before adding another detail.' },
  Refinement: { title: 'Refinement check', intro: 'Refine only the decisions the picture still needs.', focus: ['Selective detail', 'Edge control', 'Accents', 'Simplification'], next: 'Use your smallest detail only at the focal point.' },
  'Nearly Finished': { title: 'Final-pass check', intro: 'Change less. Preserve what is already working.', focus: ['Unity', 'Last accents', 'Quiet areas', 'Intentional stopping'], next: 'Step away for two minutes before making one final adjustment.' },
  Finished: { title: 'Reflection check', intro: 'The goal now is to understand what you would carry forward.', focus: ['What worked', 'What changed', 'One next exercise', 'Process notes'], next: 'Write one sentence you want to remember for the next study.' },
};

export function WipCritique({ study, onClose }: { study: ReferenceStudy; onClose: () => void }) {
  const [intentOpen, setIntentOpen] = useState(true);
  const [intent, setIntent] = useState<CritiqueIntentSelection | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [requested, setRequested] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const stageCritique = stage ? stageGuidance[stage] : null;
  const critique = stageCritique && intent && !intent.areas.includes('Everything')
    ? { ...stageCritique, focus: intent.areas }
    : stageCritique;
  if (intentOpen) return <CritiqueIntent target="AI Critique" onClose={onClose} onContinue={(intent) => { setIntent(intent); setIntentOpen(false); }} />;
  return <div className="wip-backdrop" role="presentation" onMouseDown={onClose}><section className="wip-critique" role="dialog" aria-modal="true" aria-labelledby="wip-title" onMouseDown={(event) => event.stopPropagation()}><button className="wip-close" aria-label="Close Work-in-Progress Critique" onClick={onClose}>×</button>{!requested ? <><header><p className="eyebrow">Work-in-progress critique · {study.title}</p><h2 id="wip-title">What stage are you at?</h2><p>We’ll only look at decisions that matter at this point in the work.</p></header><div className="wip-stage-list">{stages.map((option) => <button key={option} aria-pressed={stage === option} className={stage === option ? 'selected' : ''} onClick={() => setStage(option)}>{option}</button>)}</div><footer><label className="wip-upload">Add current work <input type="file" accept="image/*" onChange={(event) => setUploadName(event.target.files?.[0]?.name ?? '')} /><small>{uploadName || 'Optional · JPEG, PNG, or HEIC'}</small></label><button className="wip-submit" disabled={!stage} onClick={() => setRequested(true)}>Get stage feedback <span>↗</span></button></footer></> : critique && <><header><p className="eyebrow">{stage} · progress check</p><h2 id="wip-title">{critique.title}</h2><p>{critique.intro}</p></header><section className="wip-response"><p className="eyebrow">Look at these now</p><div>{critique.focus.map((item) => <span key={item}>{item}</span>)}</div><section><p className="eyebrow">One next check</p><strong>{critique.next}</strong></section><button className="wip-again" onClick={() => setRequested(false)}>Choose another stage</button></section></>}</section></div>;
}
