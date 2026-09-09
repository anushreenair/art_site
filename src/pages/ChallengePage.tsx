import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { challengeHistory, getDailyChallenge, weeklyThemes } from '../data/challenges';
import { CreationBoundary } from '../components/CreationBoundary';

export function ChallengePage() {
  const challenge = getDailyChallenge();
  const [joined, setJoined] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [uploadedName, setUploadedName] = useState('');
  const weeklyProgress = completed ? 4 : joined ? 3 : 2;

  return <AppShell>
    <section className="challenge-hero">
      <div><p className="eyebrow">A shared studio brief</p><h1 aria-label="Today's Challenge">Today's<br /><em>Challenge</em></h1><p className="challenge-theme">{challenge.theme}</p></div>
      <p className="challenge-intro">One reference, many points of view. Make it yours, then see how the same image travelled through other artists’ hands.</p>
    </section>
    <section className="daily-challenge">
      <div className="challenge-image"><img src={challenge.reference.imageUrl} alt={challenge.reference.alt} /><span>{challenge.reference.rights}</span></div>
      <div className="challenge-copy">
        <p className="eyebrow">Today’s study</p><h2>{challenge.title}</h2><p className="challenge-description">Build a focused study from this reference. Look for the decision that gives the scene its charge.</p>
        <dl className="challenge-specs"><div><dt>Difficulty</dt><dd>{challenge.reference.difficulty}</dd></div><div><dt>Suggested medium</dt><dd>{challenge.reference.medium}</dd></div><div><dt>Time limit</dt><dd>{challenge.reference.time}</dd></div><div><dt>Main skill</dt><dd>{challenge.mainSkill}</dd></div></dl>
        <p className="participants"><strong>{challenge.participants.toLocaleString()}</strong> participants are making this study.</p>
        {!joined ? <button className="join-challenge" aria-label="Join Challenge" onClick={() => setJoined(true)}>Join Challenge <span>↗</span></button> : <div className="joined-challenge"><strong>You’re in.</strong><Link to={`/practice/${challenge.reference.id}`}>Open the workspace ↗</Link><button onClick={() => setCompleted(true)}>Complete challenge</button></div>}
        {completed && <div className="challenge-upload"><label htmlFor="challenge-upload">Upload your attempt</label><input id="challenge-upload" type="file" accept="image/*" onChange={(event) => setUploadedName(event.target.files?.[0]?.name ?? '')} />{uploadedName && <p>{uploadedName} is ready to save with your session.</p>}</div>}
      </div>
    </section>
    <section className="challenge-progress">
      <div className="streak-orb"><span>Daily streak</span><strong>6</strong><small>days made</small></div>
      <div className="weekly-progress"><p className="eyebrow">This week · {challenge.theme}</p><h2>{weeklyProgress} of 7 shared studies</h2><div aria-label={`${weeklyProgress} of 7 weekly challenges complete`} className="week-track">{Array.from({ length: 7 }, (_, index) => <i className={index < weeklyProgress ? 'complete' : ''} key={index} />)}</div><p>Return tomorrow for a new point of view.</p></div>
      <div className="theme-list"><p className="eyebrow">Weekly themes</p>{weeklyThemes.map((theme) => <span className={theme === challenge.theme ? 'active' : ''} key={theme}>{theme}</span>)}</div>
    </section>
    <section className="challenge-history"><p className="eyebrow">Challenge history</p><h2>The work you showed up for.</h2><div>{challengeHistory.map((entry) => <article key={entry.day}><span>{entry.day}</span><strong>{entry.title}</strong><em>{entry.result}</em><small>{entry.score}</small></article>)}</div><CreationBoundary startTo={`/practice/${challenge.reference.id}`} /></section>
  </AppShell>;
}
