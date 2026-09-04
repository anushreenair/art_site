import { useState } from 'react';
import { AppShell } from '../components/AppShell';

type ArtworkPermissions = {
  visibility: 'Public' | 'Private';
  aiCritique: boolean;
  downloads: boolean;
  communityCritique: boolean;
  learningExample: boolean;
  aiTraining: boolean;
};

const initialPermissions: ArtworkPermissions = {
  visibility: 'Private',
  aiCritique: true,
  downloads: false,
  communityCritique: true,
  learningExample: false,
  aiTraining: false,
};

const sharingPermissions: Array<{ key: Exclude<keyof ArtworkPermissions, 'visibility' | 'aiTraining'>; label: string; note: string }> = [
  { key: 'aiCritique', label: 'Allow AI Critique', note: 'Use this artwork only to generate constructive feedback for you.' },
  { key: 'downloads', label: 'Allow Downloads', note: 'Let other artists save a copy of the image.' },
  { key: 'communityCritique', label: 'Allow Community Critique', note: 'Invite structured feedback from the Atelier community.' },
  { key: 'learningExample', label: 'Allow Community Learning Example', note: 'Let Atelier feature this work as a helpful learning example.' },
];

export function ArtistRightsPage() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [saved, setSaved] = useState(false);
  const changePermission = (key: keyof ArtworkPermissions, value: boolean) => {
    setPermissions((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  return (
    <AppShell>
      <section className="artist-rights">
        <header className="rights-hero">
          <div><p className="eyebrow">Artist rights &amp; AI privacy</p><h1 aria-label="Your artwork remains yours">Your artwork<br />remains <em>yours.</em></h1></div>
          <p>Every decision below applies to the selected upload. Your work is never made public, downloadable, or available for AI training without a clear choice from you.</p>
        </header>

        <section className="rights-selected" aria-label="Selected artwork"><img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=85" alt="Warm paint study" /><div><p className="eyebrow">Selected artwork</p><strong>Window-light portrait · unfinished study</strong><span>Choose permissions for this artwork</span></div></section>

        <div className="rights-settings">
          <section className="rights-section">
            <header><p className="eyebrow">Visibility</p><h2>Who can see the work?</h2></header>
            <div className="visibility-options" role="radiogroup" aria-label="Artwork visibility">
              {(['Private', 'Public'] as const).map((visibility) => <label key={visibility}><input aria-label={visibility} type="radio" name="visibility" value={visibility} checked={permissions.visibility === visibility} onChange={() => { setPermissions((current) => ({ ...current, visibility })); setSaved(false); }} /> <span><strong>{visibility}</strong><small>{visibility === 'Private' ? 'Only you can see this work.' : 'It can appear on your public artist profile.'}</small></span></label>)}
            </div>
          </section>

          <section className="rights-section">
            <header><p className="eyebrow">Critique &amp; sharing</p><h2>Choose how this work can help.</h2></header>
            <div className="permission-list">{sharingPermissions.map((permission) => <label className="permission-control" key={permission.key}><span><strong>{permission.label}</strong><small>{permission.note}</small></span><input aria-label={permission.label} type="checkbox" checked={permissions[permission.key]} onChange={(event) => changePermission(permission.key, event.target.checked)} /></label>)}</div>
          </section>

          <section className="ai-training-setting">
            <div><p className="eyebrow">AI improvement / training</p><h2>Off unless you decide otherwise.</h2><p>Allowing AI Improvement / Training permits this artwork to be used to improve future Atelier AI systems. It is separate from AI Critique.</p><p>You can switch this off at any time.</p></div>
            <label className="training-toggle"><span>Allow AI Improvement / Training</span><input aria-label="Allow AI Improvement / Training" type="checkbox" checked={permissions.aiTraining} onChange={(event) => changePermission('aiTraining', event.target.checked)} /></label>
          </section>
        </div>
        <footer className="rights-footer"><p>{saved ? 'Permissions saved for this artwork.' : 'Review these choices before sharing your work.'}</p><button onClick={() => setSaved(true)}>Save artwork permissions <span>↗</span></button></footer>
      </section>
    </AppShell>
  );
}
