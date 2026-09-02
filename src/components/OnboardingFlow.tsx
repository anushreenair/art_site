import { useState } from 'react';
import { Link } from 'react-router-dom';

type Preferences = { level: string; mediums: string[]; goals: string[]; interests: string[] };
const steps = [
  { title: 'Where are you today?', note: 'There’s no right answer—this just helps us set a useful pace.', key: 'level' as const, choices: ['Starting out', 'Developing', 'Confident', 'Returning'] },
  { title: 'What do you like to use?', note: 'Choose every medium you’d like to explore.', key: 'mediums' as const, choices: ['Drawing', 'Watercolour', 'Oil paint', 'Digital', 'Mixed media'] },
  { title: 'What would feel good to improve?', note: 'Pick the practices you want more room for.', key: 'goals' as const, choices: ['Build a daily habit', 'Understand light', 'Draw people', 'Find my style'] },
  { title: 'What pulls you in?', note: 'Your reference shelves will start here.', key: 'interests' as const, choices: ['Portrait', 'Landscape', 'Flowers', 'Animals', 'Architecture', 'Abstract'] },
];

export function OnboardingFlow({ onComplete }: { onComplete: (preferences: Preferences) => void }) {
  const [step, setStep] = useState(0); const [done, setDone] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({ level: '', mediums: [], goals: [], interests: [] });
  const current = steps[step]; const value = preferences[current.key]; const selected = Array.isArray(value) ? value : value ? [value] : [];
  const toggle = (choice: string) => setPreferences((previous) => {
    if (current.key === 'level') return { ...previous, level: choice };
    const list = previous[current.key] as string[];
    return { ...previous, [current.key]: list.includes(choice) ? list.filter((item) => item !== choice) : [...list, choice] };
  });
  const next = () => { if (step === steps.length - 1) { setDone(true); onComplete(preferences); } else setStep((value) => value + 1); };
  if (done) return <section className="onboarding-complete"><p className="eyebrow">A small beginning</p><h1>Your first practice is ready.</h1><p>We made a starting shelf for you. Change it anytime as your work changes.</p><Link className="button button-dark" to="/">Start Practising <span>↗</span></Link></section>;
  return <section className="onboarding-flow"><div className="onboarding-progress"><span>0{step + 1}</span><i style={{ transform: `scaleX(${(step + 1) / steps.length})` }} /><span>0{steps.length}</span></div><p className="eyebrow">Set your studio</p><h1>{current.title}</h1><p>{current.note}</p><div className="choice-grid">{current.choices.map((choice) => <button key={choice} className={selected.includes(choice) ? 'selected' : ''} aria-pressed={selected.includes(choice)} onClick={() => toggle(choice)}>{choice}<span>{selected.includes(choice) ? '✓' : '+'}</span></button>)}</div><button className="button button-dark continue-button" disabled={selected.length === 0} onClick={next}>{step === steps.length - 1 ? 'See my practice' : 'Continue'} <span>→</span></button></section>;
}
