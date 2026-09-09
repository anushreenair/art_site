import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { PracticeReflection } from '../components/PracticeReflection';
import { buildPracticeSession, type PracticeChoices, type PracticeLength, type PracticeSession } from '../lib/practiceSession';
import type { Difficulty, Medium, Skill, Subject } from '../types/content';

const subjects: Subject[] = ['Portrait', 'Landscape', 'Flowers', 'Animals', 'Architecture', 'Still Life', 'Human Figure', 'Hands', 'Eyes', 'Nature', 'Objects', 'Abstract'];
const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
const mediums: Medium[] = ['Oil Painting', 'Acrylic', 'Watercolour', 'Gouache', 'Pencil', 'Colored Pencil', 'Chalk', 'Charcoal', 'Pastel', 'Ink', 'Mixed Media'];
const skills: Skill[] = ['Lighting', 'Skin Tones', 'Perspective', 'Colour Mixing', 'Texture', 'Composition', 'Values', 'Shadows', 'Proportions', 'Anatomy', 'Brush Control', 'Edges', 'Depth', 'Contrast'];
const lengths: PracticeLength[] = ['5 minutes', '10 minutes', '20 minutes', '30 minutes', '45 minutes', '1 hour', '2 hours', 'No Time Limit'];
const initialChoices: PracticeChoices = { subject: 'Portrait', difficulty: 'Intermediate', medium: 'Watercolour', skills: ['Lighting', 'Skin Tones'], time: '30 minutes' };

function formatClock(seconds: number) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }

export function PracticeGenerator() {
  const [choices, setChoices] = useState<PracticeChoices>(initialChoices);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle');
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);

  useEffect(() => {
    if (status !== 'running' || remaining === 0) return;
    const interval = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [status, remaining]);

  useEffect(() => { if (status === 'running' && remaining === 0 && session?.seconds) setStatus('finished'); }, [remaining, session, status]);

  const choose = <K extends Exclude<keyof PracticeChoices, 'skills'>>(key: K, value: PracticeChoices[K]) => { setChoices((current) => ({ ...current, [key]: value })); setSession(null); setStatus('idle'); setSaved(false); };
  const toggleSkill = (skill: Skill) => { setChoices((current) => ({ ...current, skills: current.skills.includes(skill) && current.skills.length > 1 ? current.skills.filter((item) => item !== skill) : current.skills.includes(skill) ? current.skills : [...current.skills, skill] })); setSession(null); setStatus('idle'); setSaved(false); };
  const generate = () => { const next = buildPracticeSession(choices); setSession(next); setRemaining(next.seconds); setStatus('idle'); setGuidanceOpen(false); setSaved(false); setJournalOpen(false); };
  const restart = () => { if (!session) return; setRemaining(session.seconds); setStatus('idle'); };

  return <AppShell><section className="generator-intro"><p className="eyebrow">Personal practice generator</p><h1 aria-label="What do you want to practise?">What do you want<br />to <em>practise?</em></h1><p>Choose the work you have time for. We’ll shape it into one focused studio session. <Link to="/micro-practice">Only have minutes? Try micro-practice ↗</Link></p><Link className="external-entry-link" to="/references/add">+ Add External Reference</Link></section><section className="generator-shell"><div className="generator-choices"><ChoiceGroup label="Subject" options={subjects} selected={choices.subject} onChoose={(value) => choose('subject', value as Subject)} /><ChoiceGroup label="Difficulty" options={difficulties} selected={choices.difficulty} onChoose={(value) => choose('difficulty', value as Difficulty)} /><ChoiceGroup label="Medium" options={mediums} selected={choices.medium} onChoose={(value) => choose('medium', value as Medium)} /><ChoiceGroup label="Skill focus" options={skills} selected={choices.skills} multi onChoose={(value) => toggleSkill(value as Skill)} /><ChoiceGroup label="Available time" options={lengths} selected={choices.time} onChoose={(value) => choose('time', value as PracticeLength)} /><button className="generate-practice" aria-label="Generate my practice" onClick={generate}>Generate my practice <span>↗</span></button></div>{session ? <SessionBrief session={session} remaining={remaining} status={status} guidanceOpen={guidanceOpen} saved={saved} onStart={() => setStatus('running')} onPause={() => setStatus('paused')} onRestart={restart} onAddTime={() => setRemaining((value) => value + 600)} onFinish={() => { setStatus('finished'); setJournalOpen(true); }} onToggleGuidance={() => setGuidanceOpen((open) => !open)} onSave={() => setSaved(true)} /> : <aside className="generator-empty"><span>✦</span><p>Your brief will arrive here.</p><small>One reference. One intention. A little protected time.</small></aside>}</section>{journalOpen && session && <PracticeReflection sessionTitle={session.title} onClose={() => setJournalOpen(false)} />}</AppShell>;
}

function ChoiceGroup({ label, options, selected, multi = false, onChoose }: { label: string; options: readonly string[]; selected: string | string[]; multi?: boolean; onChoose: (value: string) => void }) {
  const selectedValues = Array.isArray(selected) ? selected : [selected];
  return <fieldset className="choice-group"><legend>{label}{multi && <small>Choose one or more</small>}</legend><div>{options.map((option) => <button key={option} type="button" aria-pressed={selectedValues.includes(option)} className={selectedValues.includes(option) ? 'selected' : ''} onClick={() => onChoose(option)}>{option}</button>)}</div></fieldset>;
}

function SessionBrief({ session, remaining, status, guidanceOpen, saved, onStart, onPause, onRestart, onAddTime, onFinish, onToggleGuidance, onSave }: { session: PracticeSession; remaining: number; status: 'idle' | 'running' | 'paused' | 'finished'; guidanceOpen: boolean; saved: boolean; onStart: () => void; onPause: () => void; onRestart: () => void; onAddTime: () => void; onFinish: () => void; onToggleGuidance: () => void; onSave: () => void }) {
  const timeless = session.seconds === 0;
  return <aside className="session-brief"><p className="eyebrow">Your studio brief</p><h2>{session.title}</h2><div className="brief-reference"><img src={session.study.imageUrl} alt={session.study.alt} /><div><span>Reference</span><strong>{session.study.title}</strong><Link to={`/practice/${session.study.id}`}>Open workspace ↗</Link></div></div><dl><div><dt>Goal</dt><dd>{session.goal}</dd></div><div><dt>Focus</dt><dd>Focus: {session.skills.join(' + ')}</dd></div></dl><section className="session-timer" aria-label="Practice timer"><span>{status === 'finished' ? 'Practice complete' : status === 'running' ? 'In progress' : 'Ready when you are'}</span><strong>{timeless ? 'No time limit' : formatClock(remaining)}</strong>{status === 'running' ? <button onClick={onPause}>Pause</button> : <button onClick={onStart} disabled={status === 'finished'}>Start</button>}</section><div className="brief-actions"><button onClick={onRestart}>Restart</button><button onClick={onAddTime}>Add 10 Minutes</button><button onClick={onFinish}>Finish Practice</button><button className="save-session" onClick={onSave}>{saved ? 'Session saved' : 'Save Session'}</button></div><button className="guidance-reveal" onClick={onToggleGuidance}>{guidanceOpen ? 'Hide optional guidance' : 'Show optional guidance'}</button>{guidanceOpen && <p className="brief-guidance">{session.guidance}</p>}</aside>;
}
