import { useState } from 'react';
import { AppShell } from '../components/AppShell';

type RoulettePrompt = {
  title: string;
  subject: string;
  medium: string;
  skill: string;
  difficulty: string;
  constraint: string;
  time: string;
  cue: string;
};

const promptDeck: RoulettePrompt[] = [
  { title: '25-Minute Gouache Flower Study', subject: 'Flowers', medium: 'Gouache', skill: 'Edges', difficulty: 'Intermediate', constraint: 'Maximum 5 Colours', time: '25 minutes', cue: 'Find the soft-to-sharp rhythm at the edge of each petal.' },
  { title: '20-Minute Pencil Hand Study', subject: 'Hands', medium: 'Pencil', skill: 'Proportions', difficulty: 'Beginner', constraint: 'No erasing after 5 minutes', time: '20 minutes', cue: 'Build the palm as one clear block before describing the fingers.' },
  { title: '30-Minute Watercolour Street Study', subject: 'Architecture', medium: 'Watercolour', skill: 'Perspective', difficulty: 'Intermediate', constraint: 'Leave three areas completely white', time: '30 minutes', cue: 'Let the strongest perspective lines lead directly to the focal point.' },
  { title: '15-Minute Charcoal Animal Study', subject: 'Animals', medium: 'Charcoal', skill: 'Values', difficulty: 'Beginner', constraint: 'Use only three values', time: '15 minutes', cue: 'Mass in the silhouette before finding the texture.' },
];

export function ArtRoulettePage() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [started, setStarted] = useState(false);
  const prompt = promptDeck[promptIndex];

  const rollAgain = () => {
    setPromptIndex((index) => (index + 1) % promptDeck.length);
    setSaved(false);
    setStarted(false);
  };

  return (
    <AppShell>
      <section className="art-roulette">
        <header className="roulette-hero">
          <div>
            <p className="eyebrow">Art block mode · Art roulette</p>
            <h1 aria-label="I don't know what to create">I don&apos;t know<br />what to <em>create.</em></h1>
          </div>
          <p>No searching, no second-guessing. Take one focused prompt, set a small constraint, and begin.</p>
        </header>

        {!started ? <section className="roulette-stage" aria-live="polite">
          <div className="roulette-orbit" aria-hidden="true">
            <span>✦</span><i /><b />
          </div>
          <article className="roulette-card">
            <div className="roulette-card-heading">
              <p className="eyebrow">Drawn for your studio</p>
              <span>Prompt {String(promptIndex + 1).padStart(2, '0')} / {String(promptDeck.length).padStart(2, '0')}</span>
            </div>
            <h2>{prompt.title}</h2>
            <p className="roulette-cue">{prompt.cue}</p>
            <dl>
              <div><dt>Subject</dt><dd>{prompt.subject}</dd></div>
              <div><dt>Medium</dt><dd>{prompt.medium}</dd></div>
              <div><dt>Focus</dt><dd>{prompt.skill}</dd></div>
              <div><dt>Level</dt><dd>{prompt.difficulty}</dd></div>
              <div><dt>Time</dt><dd>{prompt.time}</dd></div>
              <div className="roulette-constraint"><dt>Constraint</dt><dd>{prompt.constraint}</dd></div>
            </dl>
            <footer>
              <button className="roulette-roll" onClick={rollAgain}>Roll Again <span>↻</span></button>
              <button className="roulette-save" onClick={() => setSaved(true)}>{saved ? 'Saved for later' : 'Save For Later'}</button>
              <button className="roulette-start" onClick={() => setStarted(true)}>Start Practice <span>↗</span></button>
            </footer>
          </article>
        </section> : <section className="roulette-session" aria-live="polite"><p className="eyebrow">Practice session ready</p><h2>{prompt.title}</h2><p>Start with the first five minutes only. You can decide what comes next after you have made marks.</p></section>}
      </section>
    </AppShell>
  );
}
