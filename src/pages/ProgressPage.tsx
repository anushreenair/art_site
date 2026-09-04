import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { improvingSkills, monthlySummary, recentFeedback, weeklyPractice } from '../data/progress-data';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const points = weeklyPractice.map((minutes, index) => `${index * 48 + 16},${80 - minutes}`).join(' ');

export function ProgressPage() {
  const weeklyMinutes = weeklyPractice.reduce((total, value) => total + value, 0);
  return <AppShell>
    <section className="progress-hero"><div><p className="eyebrow">Progress / your studio record</p><h1 aria-label="Your practice ledger">Your practice<br /><em>ledger.</em></h1><p>A record of the work you made, the things you are seeing more clearly, and the next useful return to the page.</p></div><div className="progress-date"><span>September 2026</span><strong>Week 2</strong><small>Monday to Sunday</small></div></section>
    <section className="progress-metrics" aria-label="Practice statistics"><Metric label="Practice hours this week" value="5.7" detail="hours · 174 minutes" /><Metric label="Artwork completed" value="14" detail="4 this month" /><Metric label="Current streak" value="6" detail="days in a row" /><Metric label="Challenges completed" value="4" detail="one more this week" /></section>
    <section className="practice-analytics"><div className="weekly-chart"><header><div><p className="eyebrow">Weekly practice goal</p><h2>Five hours, made visible.</h2></div><strong>{Math.round((weeklyMinutes / 300) * 100)}%</strong></header><svg viewBox="0 0 320 100" role="img" aria-label="Practice hours this week"><path d="M16 80H304" /><polyline points={points} /><g>{weeklyPractice.map((minutes, index) => <circle key={days[index]} cx={index * 48 + 16} cy={80 - minutes} r="3" />)}</g></svg><div className="chart-days">{days.map((day, index) => <span key={day} className={weeklyPractice[index] ? 'made' : ''}>{day}</span>)}</div><p><strong>{weeklyMinutes} minutes</strong> made so far. Your weekly goal is 300 minutes.</p></div><aside className="practice-observation"><p className="eyebrow">A useful observation</p><h2>You have practised portraits regularly but haven't worked on perspective recently.</h2><p>Keep your portrait rhythm, then add one short spatial study before your next longer session.</p><Link to="/practice/ref-architecture-two">20-Minute Perspective Exercise <span>↗</span></Link></aside></section>
    <section className="skill-signal"><header><div><p className="eyebrow">Skills improving</p><h2>What your practice is teaching you.</h2></div><p>Levels are a gentle reflection of consistent study—not a grade.</p></header><div>{improvingSkills.map((skill) => <article key={skill.label}><div><strong>{skill.label}</strong><span>Level {skill.level}</span></div><i className={skill.colour}><b style={{ width: `${skill.level * 10}%` }} /></i><small>{skill.change}</small></article>)}</div></section>
    <section className="progress-feedback"><div><p className="eyebrow">Recent AI feedback</p><FeedbackNote feedback={recentFeedback[0]} /></div><div><p className="eyebrow">Recent community feedback</p><FeedbackNote feedback={recentFeedback[1]} /></div></section>
    <section className="progress-lower"><section className="path-progress"><p className="eyebrow">Learning path progress</p><h2>Learn Portrait Painting</h2><p>Three of ten practice studies are now part of your hand.</p><div><span className="complete">Face Proportions</span><span className="complete">Eyes</span><span className="complete">Nose</span><span>Skin Tones</span><span>Three-Quarter Portrait</span><span>Full Portrait</span></div><Link to="/learning">Continue the path <span>→</span></Link></section><section className="monthly-summary"><p className="eyebrow">Monthly summary</p><h2>September, so far.</h2>{monthlySummary.map(([label, value, note]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</section></section>
  </AppShell>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>;
}

function FeedbackNote({ feedback }: { feedback: typeof recentFeedback[number] }) {
  return <article className={`feedback-note ${feedback.tone}`}><header><span>{feedback.source}</span><small>{feedback.time}</small></header><h2>{feedback.title}</h2><p>{feedback.note}</p><Link to="/compare/ref-portrait">Review the study <span>↗</span></Link></article>;
}
