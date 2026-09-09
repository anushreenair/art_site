import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveJournalEntry } from '../lib/practiceJournal';

type ReflectionFields = { worked: string; difficult: string; learned: string; improve: string };
const emptyFields: ReflectionFields = { worked: '', difficult: '', learned: '', improve: '' };

export function PracticeReflection({ sessionTitle, onClose }: { sessionTitle: string; onClose: () => void }) {
  const [fields, setFields] = useState(emptyFields);
  const [saved, setSaved] = useState(false);
  const update = (field: keyof ReflectionFields, value: string) => setFields((current) => ({ ...current, [field]: value }));
  const save = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); saveJournalEntry({ sessionTitle, ...fields }); setSaved(true); };

  return <div className="journal-backdrop" role="presentation" onMouseDown={onClose}><section className="practice-reflection" role="dialog" aria-modal="true" aria-labelledby="reflection-title" onMouseDown={(event) => event.stopPropagation()}>{saved ? <div className="reflection-saved"><p className="eyebrow">Practice journal</p><h2 id="reflection-title">Reflection saved.</h2><p>Small observations make the next session more useful.</p><Link to="/journal">View journal ↗</Link><button onClick={onClose}>Back to practice</button></div> : <form onSubmit={save}><header><p className="eyebrow">Practice complete · optional reflection</p><h2 id="reflection-title">A few words for the work?</h2><p>Keep it honest and short. Your future studio self will thank you.</p></header><div className="reflection-fields"><label>What worked today?<textarea value={fields.worked} onChange={(event) => update('worked', event.target.value)} placeholder="A decision, a moment, a small win." /></label><label>What was difficult?<textarea value={fields.difficult} onChange={(event) => update('difficult', event.target.value)} placeholder="Name the friction without fixing it yet." /></label><label>What did you learn?<textarea value={fields.learned} onChange={(event) => update('learned', event.target.value)} placeholder="One thing to carry forward." /></label><label>What would you like to improve next?<textarea value={fields.improve} onChange={(event) => update('improve', event.target.value)} placeholder="A clear direction for next time." /></label></div><footer><button type="button" onClick={onClose}>Skip for now</button><button aria-label="Save reflection" className="reflection-save" type="submit">Save reflection <span>↗</span></button></footer></form>}</section></div>;
}
