import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';

type StudioSession = {
  title: string;
  schedule: string;
  minutes: number;
  medium: string;
  focus: string;
  artists: number;
  reference: { image: string; alt: string; title: string };
};

const sessions: StudioSession[] = [
  { title: '45-Minute Portrait Study', schedule: 'Live now · ends in 32 min', minutes: 45, medium: 'Pencil or charcoal', focus: 'Values + proportion', artists: 18, reference: { image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1100&q=85', alt: 'Portrait in soft window light', title: 'Window-light portrait' } },
  { title: 'Beginner Watercolour Studio', schedule: 'Today · 6:30 PM', minutes: 30, medium: 'Watercolour', focus: 'Soft edges', artists: 12, reference: { image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1100&q=85', alt: 'Light pink blossom branches', title: 'Tulips in a glass' } },
  { title: 'Saturday Sketch Club', schedule: 'Saturday · 10:00 AM', minutes: 60, medium: 'Any dry medium', focus: 'Gesture + observation', artists: 24, reference: { image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1100&q=85', alt: 'Coffee cup and notebook on a table', title: 'Morning cup' } },
  { title: 'Urban Sketching — Bangalore', schedule: 'Sunday · Cubbon Park', minutes: 90, medium: 'Ink + wash', focus: 'Perspective', artists: 9, reference: { image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1100&q=85', alt: 'Light-filled architectural interior', title: 'Sunlit corridor' } },
];

function formatClock(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function StudioSessionsPage() {
  const [activeSession, setActiveSession] = useState<StudioSession | null>(null);
  const [sameReference, setSameReference] = useState(true);
  const [running, setRunning] = useState(true);
  const [remaining, setRemaining] = useState(45 * 60);
  const [shareOpen, setShareOpen] = useState(false);
  const [uploadedName, setUploadedName] = useState('');
  const [critiqueRequested, setCritiqueRequested] = useState(false);

  useEffect(() => {
    if (!activeSession || !running || remaining === 0) return;
    const timer = window.setInterval(() => setRemaining((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [activeSession, running, remaining]);

  const join = (session: StudioSession) => {
    setActiveSession(session);
    setSameReference(true);
    setRemaining(session.minutes * 60);
    setRunning(true);
    setShareOpen(false);
    setUploadedName('');
    setCritiqueRequested(false);
  };

  if (activeSession) return <AppShell><section className="session-room">
    <header className="session-room__header"><div><p className="eyebrow">Studio session · {activeSession.schedule}</p><h1>{activeSession.title}</h1></div><button className="session-leave" onClick={() => setActiveSession(null)}>Leave room</button></header>
    <div className="session-room__stage">
      <figure><img src={activeSession.reference.image} alt={activeSession.reference.alt} /><figcaption>Shared reference · {activeSession.reference.title}</figcaption></figure>
      <aside>
        <p className="eyebrow">Shared timer</p><strong className="session-clock" aria-live="polite">{formatClock(remaining)}</strong><p>{running ? 'A little protected time, together.' : remaining === 0 ? 'The session has come to a close.' : 'Timer paused for everyone in this room.'}</p>
        <button className="session-timer-toggle" onClick={() => setRunning((value) => !value)} disabled={remaining === 0}>{running ? 'Pause shared timer' : 'Resume shared timer'}</button>
        <div className="session-choice" aria-label="Practice mode"><span>How would you like to work?</span><button aria-pressed={sameReference} onClick={() => setSameReference(true)}>Use Same Reference</button><button aria-pressed={!sameReference} onClick={() => setSameReference(false)}>Work Independently</button></div>
      </aside>
    </div>
    <section className="session-room__details"><div><p className="eyebrow">Your session</p><h2>{sameReference ? 'Stay with the shared observation.' : 'Keep the rhythm; choose your own subject.'}</h2></div><dl><div><dt>Medium</dt><dd>{activeSession.medium}</dd></div><div><dt>Focus</dt><dd>{activeSession.focus}</dd></div><div><dt>In the room</dt><dd>{activeSession.artists} artists</dd></div></dl></section>
    <footer className="session-actions"><div><p className="eyebrow">At the end</p><p>No stream, no scroll—just a small place to return with your work.</p></div><div><button aria-label="Share Result at End" className="session-share" onClick={() => setShareOpen((value) => !value)}>Share Result at End <span>↗</span></button><button className="session-critique" onClick={() => setCritiqueRequested(true)}>Request Critique</button></div></footer>
    {shareOpen && <div className="session-upload"><label htmlFor="session-result">Upload session result</label><input id="session-result" type="file" accept="image/*" onChange={(event) => setUploadedName(event.target.files?.[0]?.name ?? '')} />{uploadedName && <p>{uploadedName} is ready to share after the session.</p>}</div>}
    {critiqueRequested && <p className="session-critique-note">Your request will lead with the work, not popularity. <Link to="/community">Choose the kind of feedback you need ↗</Link></p>}
  </section></AppShell>;

  return <AppShell><section className="sessions-hero"><div><p className="eyebrow">Studio sessions</p><h1 aria-label="Studio Sessions — Make the work in good company">Make the work,<br /><em>in good company.</em></h1></div><div><p>Gentle, shared practice rooms for showing up at the same time—not performing for a feed.</p><span>No feed. No performance. Just shared time to make the work.</span></div></section><section className="session-list" aria-label="Available studio sessions"><header><p className="eyebrow">Choose a quiet table</p><p>References and timers are shared. The work stays your own.</p></header>{sessions.map((session, index) => <article key={session.title} className={index === 0 ? 'session-card featured' : 'session-card'}><img src={session.reference.image} alt={session.reference.alt} /><div><p className="eyebrow">{session.schedule}</p><h2>{session.title}</h2><p>{session.medium} · {session.focus}</p></div><div className="session-card__meta"><span>{session.artists} making</span><span>{session.minutes} min</span><button onClick={() => join(session)}>Join Session <i>↗</i></button></div></article>)}</section></AppShell>;
}
