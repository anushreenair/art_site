import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { CreationBoundary } from '../components/CreationBoundary';
import { referenceStudies } from '../data/atelier-data';
import type { Difficulty, Medium, ReferenceStudy, Skill, StudyTime, Subject } from '../types/content';

type FocusChoices = { subject?: Subject; medium?: Medium; skill?: Skill; difficulty?: Difficulty; time?: StudyTime };
type FocusControl = { label: string; key: keyof FocusChoices; options: readonly string[] };

const controls: FocusControl[] = [
  { label: 'Subject', key: 'subject', options: ['Portrait', 'Landscape', 'Flowers', 'Hands', 'Animals', 'Still Life'] },
  { label: 'Medium', key: 'medium', options: ['Watercolour', 'Oil Painting', 'Gouache', 'Pencil', 'Charcoal', 'Ink'] },
  { label: 'Focus', key: 'skill', options: ['Lighting', 'Skin Tones', 'Perspective', 'Values', 'Composition', 'Texture'] },
  { label: 'Level', key: 'difficulty', options: ['Beginner', 'Intermediate', 'Advanced'] },
  { label: 'Time', key: 'time', options: ['10 minutes', '20 minutes', '30 minutes', '45 minutes', '1 hour'] },
];

function relevanceScore(study: ReferenceStudy, choices: FocusChoices) {
  return (choices.subject === study.subject ? 6 : 0)
    + (choices.medium === study.medium ? 5 : 0)
    + (choices.skill && study.skills.includes(choices.skill as Skill) ? 4 : 0)
    + (choices.difficulty === study.difficulty ? 3 : 0)
    + (choices.time === study.time ? 2 : 0);
}

function curateStudies(choices: FocusChoices) {
  return referenceStudies.map((study, index) => ({ study, index, score: relevanceScore(study, choices) }))
    .sort((first, second) => second.score - first.score || first.index - second.index).map(({ study }) => study);
}

export function FocusedInspirationPage() {
  const navigate = useNavigate();
  const [choices, setChoices] = useState<FocusChoices>({});
  const [shownCount, setShownCount] = useState(3);
  const curatedStudies = useMemo(() => curateStudies(choices), [choices]);
  const studies = curatedStudies.slice(0, shownCount);
  const choose = (key: keyof FocusChoices, value: string) => {
    setChoices((current) => ({ ...current, [key]: current[key] === value ? undefined : value } as FocusChoices));
    setShownCount(3);
  };

  return <AppShell><section className="focused-inspiration">
    <header className="focused-intro"><div><p className="eyebrow">Focused inspiration</p><h1 aria-label="Focused inspiration: Look with intention">Look with<br /><em>intention.</em></h1></div><p>Choose the visual problem in front of you. We’ll make a short reference shelf for the work—not a feed to get lost in.</p></header>
    <section className="focus-brief" aria-labelledby="focus-question"><div className="focus-brief-heading"><p className="eyebrow">Your brief</p><h2 id="focus-question">What are you looking for?</h2><button className="clear-focus" onClick={() => { setChoices({}); setShownCount(3); }}>Clear brief</button></div><div className="focus-controls">{controls.map((control) => <fieldset key={control.key}><legend>{control.label}</legend><div>{control.options.map((option) => <button key={option} className={choices[control.key] === option ? 'selected' : ''} aria-pressed={choices[control.key] === option} onClick={() => choose(control.key, option)}>{option}</button>)}</div></fieldset>)}</div></section>
    <section className="inspiration-shelf" aria-live="polite"><header className="shelf-heading"><div><p className="eyebrow">Curated for the easel</p><h2>A small working set.</h2></div><p>{studies.length} {studies.length === 1 ? 'study' : 'studies'} selected</p></header><div className="inspiration-grid">{studies.map((study) => <article className="inspiration-card" key={study.id}><img src={study.imageUrl} alt={study.alt} loading="lazy" /><div><p className="inspiration-meta">{study.subject} · {study.medium} · {study.time}</p><h3>{study.title}</h3><p className="inspiration-skills">{study.skills.slice(0, 2).join(' · ')}</p><button className="text-link" onClick={() => navigate(`/practice/${study.id}`)}>Start Practice <span>↗</span></button></div></article>)}</div><CreationBoundary startTo={`/practice/${studies[0]?.id ?? 'ref-portrait'}`} onShowMore={shownCount < curatedStudies.length ? () => setShownCount((count) => Math.min(count + 5, curatedStudies.length)) : undefined} /></section>
  </section></AppShell>;
}
