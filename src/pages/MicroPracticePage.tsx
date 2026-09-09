import { useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { PracticeReflection } from '../components/PracticeReflection';

type MicroExercise = { title: string; minutes: 5 | 10 | 15 | 20; medium: string; skill: string; cue: string };
const timeOptions: MicroExercise['minutes'][] = [5, 10, 15, 20];
const exercises: MicroExercise[] = [
  { title: 'Paint One Eye', minutes: 5, medium: 'Watercolour', skill: 'Skin Tones', cue: 'Find one light shape, one shadow shape, and the warmest edge.' },
  { title: 'Mix 10 Greens', minutes: 5, medium: 'Gouache', skill: 'Colour Mixing', cue: 'Make five quiet greens before reaching for a bright one.' },
  { title: 'Study Cloud Edges', minutes: 5, medium: 'Pencil', skill: 'Edges', cue: 'Give every cloud one disappearing edge.' },
  { title: 'Draw 20 Hands', minutes: 10, medium: 'Pencil', skill: 'Gesture', cue: 'Keep each hand to thirty seconds. Look for the palm angle first.' },
  { title: 'Hair Highlights', minutes: 10, medium: 'Charcoal', skill: 'Values', cue: 'Reserve the lightest marks for only two or three turns of form.' },
  { title: 'Perspective Boxes', minutes: 10, medium: 'Ink', skill: 'Perspective', cue: 'Aim every receding edge toward one quiet horizon.' },
  { title: 'Paint Glass Transparency', minutes: 15, medium: 'Watercolour', skill: 'Values', cue: 'Paint what is seen through the glass before describing the glass itself.' },
  { title: 'Fabric Folds', minutes: 15, medium: 'Charcoal', skill: 'Shadows', cue: 'Follow the long shadow path before rendering a single fold.' },
  { title: 'Metal Reflections', minutes: 15, medium: 'Gouache', skill: 'Contrast', cue: 'Put the sharpest contrast beside the clearest reflection.' },
  { title: 'Paint 5 Skin Tones', minutes: 20, medium: 'Oil Painting', skill: 'Skin Tones', cue: 'Shift temperature before you shift value.' },
  { title: 'Tree Textures', minutes: 20, medium: 'Ink', skill: 'Texture', cue: 'Describe three bark rhythms, then leave the rest simple.' },
  { title: 'Shadow Studies', minutes: 20, medium: 'Pencil', skill: 'Lighting', cue: 'Reduce the scene to three value families before adding texture.' },
];

function clock(totalSeconds: number) { return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`; }

export function MicroPracticePage() {
  const [minutes, setMinutes] = useState<MicroExercise['minutes']>(10);
  const [selectedTitle, setSelectedTitle] = useState('Draw 20 Hands');
  const [sessionOpen, setSessionOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(600);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const filtered = exercises.filter((exercise) => exercise.minutes === minutes);
  const selected = filtered.find((exercise) => exercise.title === selectedTitle) ?? filtered[0];

  useEffect(() => {
    if (!running || remaining === 0) return;
    const timer = window.setInterval(() => setRemaining((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [remaining, running]);

  const selectTime = (time: MicroExercise['minutes']) => {
    const first = exercises.find((exercise) => exercise.minutes === time)!;
    setMinutes(time);
    setSelectedTitle(first.title);
    setSessionOpen(false);
    setRunning(false);
    setRemaining(time * 60);
  };
  const begin = () => { setRemaining(selected.minutes * 60); setSessionOpen(true); setRunning(false); };

  if (sessionOpen) return <AppShell><section className="micro-session"><p className="eyebrow">A little protected time</p><h1>{selected.title}</h1><p>{selected.cue}</p><div className="micro-timer" aria-label="Micro-practice timer"><span>{running ? 'In progress' : remaining === 0 ? 'Time is up' : 'Ready when you are'}</span><strong>{clock(remaining)}</strong><button onClick={() => setRunning((current) => !current)} disabled={remaining === 0}>{running ? 'Pause' : 'Start'}</button></div><dl><div><dt>Medium</dt><dd>{selected.medium}</dd></div><div><dt>Focus</dt><dd>{selected.skill}</dd></div><div><dt>Constraint</dt><dd>One small decision at a time</dd></div></dl><footer><button onClick={() => { setSessionOpen(false); setRunning(false); }}>Choose another exercise</button><button aria-label="Finish micro practice" className="micro-finish" onClick={() => { setRunning(false); setReflectionOpen(true); }}>Finish micro practice <span>↗</span></button></footer></section>{reflectionOpen && <PracticeReflection sessionTitle={`${selected.minutes}-Minute ${selected.title}`} onClose={() => setReflectionOpen(false)} />}</AppShell>;

  return <AppShell><section className="micro-hero"><p className="eyebrow">Skill micro-practice</p><h1 aria-label="Make five minutes count">Make five<br /><em>minutes count.</em></h1><p>Small, specific exercises for the days when a full artwork is not the point.</p></section><section className="micro-picker"><header><div><p className="eyebrow">How much time do you have?</p><h2>Choose one skill. Make a few marks.</h2></div><div className="micro-times" aria-label="Available time">{timeOptions.map((time) => <button key={time} aria-pressed={minutes === time} onClick={() => selectTime(time)}>{time} minutes</button>)}</div></header><div className="micro-exercise-list" aria-label={`${minutes}-minute exercises`}>{filtered.map((exercise, index) => <button key={exercise.title} className={selected.title === exercise.title ? 'selected' : ''} aria-pressed={selected.title === exercise.title} onClick={() => setSelectedTitle(exercise.title)}><span>0{index + 1}</span><strong>{exercise.title}</strong><small>{exercise.medium} · {exercise.skill}</small></button>)}</div><article className="micro-brief"><p className="eyebrow">Your tiny studio brief</p><h2>{selected.title}</h2><p>{selected.cue}</p><dl><div><dt>Time</dt><dd>{selected.minutes} minutes</dd></div><div><dt>Medium</dt><dd>{selected.medium}</dd></div><div><dt>Focus</dt><dd>{selected.skill}</dd></div></dl><button aria-label="Start micro practice" onClick={begin}>Start micro practice <span>↗</span></button></article></section></AppShell>;
}
