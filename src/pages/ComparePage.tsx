import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { StudioCritique } from '../components/StudioCritique';
import { CritiqueIntent, type CritiqueIntentSelection } from '../components/CritiqueIntent';
import { PracticeReflection } from '../components/PracticeReflection';
import { referenceStudies } from '../data/atelier-data';

const modes = ['Side-by-Side', 'Slider Comparison', 'Overlay', 'Zoom Comparison', 'Flip Comparison', 'Grayscale Comparison'] as const;
type ComparisonMode = typeof modes[number];

export function ComparePage() {
  const { studyId } = useParams();
  const study = useMemo(() => referenceStudies.find((item) => item.id === studyId), [studyId]);
  const [mode, setMode] = useState<ComparisonMode>('Side-by-Side');
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [slider, setSlider] = useState(50);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [critiqueOpen, setCritiqueOpen] = useState(false);
  const [intentOpen, setIntentOpen] = useState(false);
  const [critiqueIntent, setCritiqueIntent] = useState<CritiqueIntentSelection | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);

  useEffect(() => () => { if (uploadUrl) URL.revokeObjectURL(uploadUrl); }, [uploadUrl]);
  if (!study) return <main className="comparison-not-found"><h1>That practice is no longer available.</h1><Link to="/explore">Return to the reference desk</Link></main>;

  const visualMode = mode === 'Side-by-Side' ? 'side-by-side' : mode === 'Slider Comparison' ? 'slider' : mode === 'Overlay' ? 'overlay' : mode === 'Zoom Comparison' ? 'zoom' : mode === 'Flip Comparison' ? 'flip' : 'grayscale';
  const myArtwork = uploadUrl ?? study.imageUrl;
  const uploadArtwork = (file: File | undefined) => { if (!file) return; if (uploadUrl) URL.revokeObjectURL(uploadUrl); setUploadUrl(URL.createObjectURL(file)); setUploadName(file.name); setSaved(false); };

  return <AppShell><section className="compare-header"><Link to={`/practice/${study.id}`}>← Back to practice</Link><p className="eyebrow">Reflect on the work</p><h1 aria-label="Reference and My Artwork"><span>Reference</span> / <em>My Artwork</em></h1><p>Look slowly. Comparison is a tool for noticing, not a scorecard.</p></section><section className="compare-layout"><div className="comparison-tools"><label className="upload-art" htmlFor="artwork-upload"><span>Upload your artwork</span><input id="artwork-upload" aria-label="Upload your artwork" type="file" accept="image/*" onChange={(event) => uploadArtwork(event.target.files?.[0])} /><small>{uploadName || 'JPEG, PNG, or HEIC'}</small></label><div className="comparison-modes" aria-label="Comparison modes">{modes.map((item) => <button key={item} aria-pressed={mode === item} onClick={() => setMode(item)}>{item}</button>)}</div>{mode === 'Slider Comparison' && <label className="slider-control">Reference balance <input type="range" min="0" max="100" value={slider} onChange={(event) => setSlider(Number(event.target.value))} /></label>}</div><section className={`comparison-canvas ${visualMode}`} aria-label="Artwork comparison" data-mode={visualMode}>{visualMode === 'side-by-side' ? <><ComparisonImage label="Reference" src={study.imageUrl} alt={study.alt} /><ComparisonImage label="My artwork" src={myArtwork} alt="My uploaded artwork" placeholder={!uploadUrl} /></> : <div className="comparison-single"><ComparisonImage label="Reference" src={study.imageUrl} alt={study.alt} /><ComparisonImage label="My artwork" src={myArtwork} alt="My uploaded artwork" placeholder={!uploadUrl} clip={visualMode === 'slider' ? slider : undefined} /></div>}</section><aside className="attempt-record"><p className="eyebrow">Attempt record</p><dl><div><dt>Practice duration</dt><dd>{study.time}</dd></div><div><dt>Medium used</dt><dd>{study.medium}</dd></div><div><dt>Skills practised</dt><dd>{study.skills.join(' · ')}</dd></div><div><dt>Completion date</dt><dd>{new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</dd></div></dl><label htmlFor="artist-notes">Artist notes</label><textarea id="artist-notes" value={notes} onChange={(event) => { setNotes(event.target.value); setSaved(false); }} placeholder="What do you notice? What would you carry into the next study?" /><button className="save-attempt" onClick={() => { setSaved(true); setJournalOpen(true); }}>{saved ? 'Attempt saved to profile' : 'Save attempt to profile'}</button><button className="generate-critique" onClick={() => setIntentOpen(true)}>Generate studio critique</button>{saved && <p className="save-note">Your local session record is ready to connect to a profile.</p>}</aside></section>{journalOpen && <PracticeReflection sessionTitle={study.title} onClose={() => setJournalOpen(false)} />}{intentOpen && <CritiqueIntent target="AI Critique" onClose={() => setIntentOpen(false)} onContinue={(intent) => { setCritiqueIntent(intent); setIntentOpen(false); setCritiqueOpen(true); }} />}{critiqueOpen && <StudioCritique study={study} intent={critiqueIntent} />}</AppShell>;
}

function ComparisonImage({ label, src, alt, placeholder = false, clip }: { label: string; src: string; alt: string; placeholder?: boolean; clip?: number }) {
  return <figure className={placeholder ? 'comparison-image placeholder' : 'comparison-image'} style={clip === undefined ? undefined : { clipPath: `inset(0 ${100 - clip}% 0 0)` }}><img src={src} alt={alt} /><figcaption>{label}{placeholder && <small>Upload to compare</small>}</figcaption></figure>;
}
