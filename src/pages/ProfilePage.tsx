import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { artworks, referenceStudies } from '../data/atelier-data';

type ArtistProfile = { photo: string; name: string; email: string; username: string; bio: string; location: string; medium: string; level: string; interests: string; goals: string };

const initialProfile: ArtistProfile = { photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=85', name: 'Mira Sol', email: '', username: '@mirasol', bio: 'Learning to catch the quiet shifts—one portrait, puddle, and stubborn colour mixture at a time.', location: 'Kochi, India', medium: 'Watercolour', level: 'Intermediate', interests: 'Portraits, colour, urban fragments', goals: 'Build confident portraits · understand warm shadow' };
const stats = [['Artwork completed', '38'], ['Practice hours', '74'], ['Challenges completed', '16'], ['Current streak', '6 days'], ['Longest streak', '18 days'], ['References saved', '127'], ['Critiques given', '23'], ['Learning paths', '4']];
const skillProgress = [['Portrait', 7], ['Watercolour', 5], ['Perspective', 3], ['Colour Mixing', 6]];

export function ProfilePage() {
  const [profile, setProfile] = useState(() => {
    try {
      const storedUser = window.localStorage.getItem('atelier-auth-user');
      const storedProfile = window.localStorage.getItem('atelier-profile');
      const user = storedUser ? JSON.parse(storedUser) as { name?: string; email?: string } : {};
      const saved = storedProfile ? JSON.parse(storedProfile) as Partial<ArtistProfile> : {};
      const name = saved.name || user.name || initialProfile.name;
      return { ...initialProfile, ...saved, name, email: user.email || saved.email || '', username: saved.username || `@${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}` };
    } catch {
      return initialProfile;
    }
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ArtistProfile>(profile);
  const [message, setMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);
  const editButton = useRef<HTMLButtonElement>(null);
  const hasEdited = useRef(false);

  useEffect(() => {
    if (editing) nameInput.current?.focus();
    else if (hasEdited.current) editButton.current?.focus();
  }, [editing]);

  const beginEditing = () => {
    setDraft({ ...profile });
    setMessage('');
    setSaveError('');
    hasEdited.current = true;
    setEditing(true);
  };
  const cancelEditing = () => {
    setDraft({ ...profile });
    setSaveError('');
    setEditing(false);
  };
  const updateDraft = (key: keyof ArtistProfile, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const next = { ...draft, name: draft.name.trim() };
    if (!next.name) { setSaveError('Please enter your artist name.'); nameInput.current?.focus(); return; }
    try {
      window.localStorage.setItem('atelier-profile', JSON.stringify(next));
    } catch {
      setSaveError('Could not save your profile. Your edits are still here. Please try again.');
      return;
    }
    // Preserve the existing signed-in name update without blocking profile saving.
    try {
      const storedUser = window.localStorage.getItem('atelier-auth-user');
      if (storedUser) window.localStorage.setItem('atelier-auth-user', JSON.stringify({ ...JSON.parse(storedUser), name: next.name }));
    } catch { /* The profile itself was saved successfully. */ }
    setProfile(next);
    setEditing(false);
    setMessage('Profile saved.');
  };

  return <AppShell>
    <form className={`profile-hero${editing ? ' profile-hero-editing' : ''}`} aria-label="Artist profile" onSubmit={saveProfile}>
      <div className="profile-photo">
        <img src={editing ? draft.photo : profile.photo} alt={`${profile.name}'s profile`} />
        {editing && <label className="profile-field">Profile photo URL<input type="url" value={draft.photo} onChange={(event) => updateDraft('photo', event.target.value)} placeholder="https://…" /></label>}
      </div>
      <div className="profile-identity">
        <p className="eyebrow">Artist profile {editing && <span className="profile-editing-badge">Editing</span>}</p>
        {editing ? <>
          <label className="profile-field profile-name-field">Artist name<input ref={nameInput} required maxLength={100} value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} autoComplete="name" /></label>
          <div className="profile-field-row">
            <label className="profile-field">Username<input value={draft.username} maxLength={100} onChange={(event) => updateDraft('username', event.target.value)} autoComplete="nickname" /></label>
            <label className="profile-field">Location<input value={draft.location} maxLength={160} onChange={(event) => updateDraft('location', event.target.value)} /></label>
          </div>
          <label className="profile-field">Bio<textarea rows={3} value={draft.bio} maxLength={1200} onChange={(event) => updateDraft('bio', event.target.value)} /></label>
          <div className="profile-field-row">
            <label className="profile-field">Favourite medium<input value={draft.medium} maxLength={100} onChange={(event) => updateDraft('medium', event.target.value)} /></label>
            <label className="profile-field">Skill level<input value={draft.level} maxLength={100} onChange={(event) => updateDraft('level', event.target.value)} /></label>
          </div>
          <label className="profile-field">Art interests<input value={draft.interests} maxLength={300} onChange={(event) => updateDraft('interests', event.target.value)} /></label>
        </> : <>
          <h1>{profile.name}</h1>
          <p className="profile-handle">{profile.username} · {profile.location}</p>
          <p className="profile-bio">{profile.bio}</p>
          <div className="profile-tags"><span>{profile.medium}</span><span>{profile.level}</span><span>{profile.interests}</span></div>
        </>}
      </div>
      <div className="profile-goals">
        <p className="eyebrow">Current learning goal</p>
        {editing ? <label className="profile-field"><span className="sr-only">Current learning goals</span><textarea rows={5} value={draft.goals} maxLength={600} onChange={(event) => updateDraft('goals', event.target.value)} placeholder="What would you like to work towards?" /></label> : <strong>{profile.goals}</strong>}
        {!editing && <><Link to="/artist-rights">Artist rights &amp; AI privacy ↗</Link><button ref={editButton} type="button" onClick={beginEditing}>Edit profile</button></>}
      </div>
      {editing ? <div className="profile-edit-actions">
        <div><p>Editing your profile</p><small>Your changes are saved when you select Save profile.</small>{saveError && <p className="profile-save-error" role="alert">{saveError}</p>}</div>
        <div className="profile-edit-buttons"><button type="button" className="profile-cancel" onClick={cancelEditing}>Cancel</button><button type="submit" className="profile-save">Save profile</button></div>
      </div> : message && <p className="profile-save-message" role="status">{message}</p>}
    </form>
    {!editing && <><section className="profile-stats">{stats.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section><section className="profile-work"><header><p className="eyebrow">Portfolio gallery</p><h2>Recent work</h2><p>Selected studies from a very human practice.</p></header><div className="profile-gallery">{artworks.slice(0, 4).map((work, index) => <figure key={work.id} className={index === 1 ? 'wide' : ''}><img src={work.imageUrl} alt={work.alt} /><figcaption><strong>{work.title}</strong><span>{work.medium}</span></figcaption></figure>)}</div></section><section className="profile-detail-grid"><section className="profile-skills"><p className="eyebrow">Skill progress</p><h2>Learning, made visible.</h2>{skillProgress.map(([skill, level]) => <div key={skill}><p>{skill} — Level {level}</p><i><b style={{ width: `${Number(level) * 10}%` }} /></i></div>)}</section><section className="profile-challenges"><p className="eyebrow">Completed challenges</p><h2>16 shared studies.</h2><article><strong>Dramatic portrait</strong><span>Portrait Week · 45 minutes</span></article><article><strong>One lamp, three values</strong><span>Light & Shadow Week · 30 minutes</span></article></section><section className="profile-collections"><p className="eyebrow">Collections</p><h2>Little shelves of attention.</h2><Link className="external-entry-link" to="/references/add">+ Add External Reference</Link>{['Window-light faces', 'Green after rain', 'Things with red in them'].map((collection, index) => <article key={collection}><span>0{index + 1}</span><strong>{collection}</strong><small>{[14, 9, 21][index]} references</small></article>)}</section></section><section className="profile-saved"><header><div><p className="eyebrow">Saved references</p><h2>Return to these.</h2></div><span>127 saved</span></header><nav className="external-entry-bar" aria-label="Saved reference actions"><Link to="/references/add">+ Add External Reference</Link><Link to="/references/saved">View saved external references ↗</Link></nav><div>{referenceStudies.slice(0, 4).map((study) => <figure key={study.id}><img src={study.imageUrl} alt={study.alt} /><figcaption>{study.title}<small>{study.subject} · {study.time}</small></figcaption></figure>)}</div></section><section className="profile-history"><header><div><p className="eyebrow">Practice history</p><h2>The rhythm of the work.</h2></div><p>Learning progress updates as each small study becomes part of the record.</p></header>{[['Today', 'Window-light portrait', '20 minutes', 'Values'], ['Yesterday', 'Leaf shadows', '10 minutes', 'Texture'], ['30 Aug', 'Sunlit corridor', '45 minutes', 'Perspective']].map((entry) => <article key={entry[0]}><span>{entry[0]}</span><strong>{entry[1]}</strong><em>{entry[2]}</em><small>{entry[3]}</small></article>)}</section></>}</AppShell>;
}
