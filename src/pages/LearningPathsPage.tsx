import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { learningPaths, type LearningPath } from '../data/learning-paths';

export function LearningPathsPage() {
  const [selectedId, setSelectedId] = useState('portrait');
  const selected = learningPaths.find((path) => path.id === selectedId) ?? learningPaths[0];

  return <AppShell>
    <section className="learning-hero"><div><p className="eyebrow">Learning paths / practice-led</p><h1 aria-label="Learning paths">Learn by<br /><em>making.</em></h1><p>Small, structured journeys for the work you want to make next. Every step ends at the page—not a video queue.</p></div><div className="learning-hero-note"><span>Studio principle</span><strong>Look. Try. Notice. Repeat.</strong></div></section>
    <section className="learning-path-index" aria-label="Learning paths"><header><div><p className="eyebrow">Choose a journey</p><h2>Find your next body of work.</h2></div><p>{learningPaths.length} paths · {learningPaths.reduce((count, path) => count + path.practiceCount, 0)} focused practices</p></header><div className="learning-path-cards">{learningPaths.map((path) => <PathCard key={path.id} path={path} selected={path.id === selectedId} onSelect={() => setSelectedId(path.id)} />)}</div></section>
    <section className={`learning-journey ${selected.colour}`} aria-label={`${selected.title} journey`}><header><div><p className="eyebrow">Selected path · {selected.level}</p><h2>{selected.title}</h2><p>{selected.subtitle}</p></div><div className="journey-progress"><span>Your path</span><strong>{selected.progress}%</strong><i><b style={{ width: `${selected.progress}%` }} /></i></div></header><div className="lesson-steps">{selected.lessons.map((lesson, index) => <article key={lesson.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{lesson.title}</h3><p>{lesson.focus}</p></div><small>{lesson.duration}</small><Link to={`/practice/${lesson.studyId}`}>Start practice <b>↗</b></Link></article>)}</div></section>
  </AppShell>;
}

function PathCard({ path, selected, onSelect }: { path: LearningPath; selected: boolean; onSelect: () => void }) {
  return <button className={`learning-path-card ${path.colour} ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={onSelect}><span>{path.level}</span><strong>{path.title}</strong><small>{path.practiceCount} practice exercises</small><i><b style={{ width: `${path.progress}%` }} /></i><em>{selected ? 'Viewing path' : 'Open path'} <b>→</b></em></button>;
}
