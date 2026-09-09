import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Link2, LockKeyhole, Upload } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { ExternalReferencePreview } from '../components/ExternalReferencePreview';
import { fetchReferenceMetadata, saveExternalReference, sourcePlatforms, type ReferenceDraft, type SourcePlatform } from '../lib/externalReferences';

const supported = ['Pinterest', 'Instagram', 'Behance', 'ArtStation', 'Museum websites', 'Photography websites', 'Blogs', 'Other public webpages'];

export function AddExternalReferencePage() {
  const [url, setUrl] = useState('');
  const [draft, setDraft] = useState<ReferenceDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const urlInput = useRef<HTMLInputElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const request = useRef(0);
  const hasDraft = draft !== null;

  useEffect(() => { if (saved) successHeading.current?.focus(); else if (hasDraft) titleInput.current?.focus(); }, [hasDraft, saved]);
  useEffect(() => () => { request.current += 1; }, []);

  const fetchPreview = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    const id = ++request.current;
    try {
      const metadata = await fetchReferenceMetadata(url);
      if (id === request.current) { setDraft(metadata); setUrl(metadata.source_url); }
    } catch (err) {
      if (id === request.current) setError(err instanceof Error ? err.message : 'This link could not be accessed. Please try again.');
    } finally { if (id === request.current) setBusy(false); }
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    setError('');
    try { setDraft(saveExternalReference(draft)); setSaved(true); }
    catch { setError('Could not save this reference in your browser. Your draft is still here. Check browser storage and try again.'); }
  };

  const reset = (clearUrl: boolean) => {
    request.current += 1;
    setDraft(null); setSaved(false); setBusy(false); setError('');
    if (clearUrl) setUrl('');
    requestAnimationFrame(() => urlInput.current?.focus());
  };

  const update = (key: 'title' | 'creator_name' | 'description', value: string) => setDraft((current) => current && ({ ...current, [key]: value }));

  return <AppShell><div className="external-page">
    <div className="external-breadcrumb"><Link to="/explore"><ArrowLeft size={14} /> Reference desk</Link><Link to="/references/saved">Saved References <ArrowRight size={14} /></Link></div>
    {saved && draft ? <section className="external-success">
      <div className="external-success-copy"><span className="external-success-icon" aria-hidden="true"><Check size={28} /></span><p className="eyebrow">A place to return to</p><h1 ref={successHeading} tabIndex={-1}>Reference added to your studio.</h1><p>Reference saved as a link only. Your details are private and saved in this browser.</p><div className="external-actions"><Link className="external-primary" to="/references/saved">View Saved References <ArrowRight size={16} /></Link><button className="external-secondary" onClick={() => reset(true)}>Add Another</button></div></div>
      <ExternalReferencePreview reference={draft} saved />
    </section> : <>
      <header className="external-heading"><p className="eyebrow">Your studio / Add reference</p><h1>Add an External Reference</h1><p>Found something inspiring online? Save the original source here and turn it into a structured practice reference.</p></header>
      <div className="external-methods" aria-label="Reference source options"><span className="external-method-selected"><Link2 size={16} /> Add From URL</span><button type="button" disabled aria-describedby="external-upload-note"><Upload size={16} /> Upload My Own Reference</button><small id="external-upload-note">Uploads are not available in this flow yet.</small></div>
      <div className="external-layout">
        <section className="external-editor" aria-label={draft ? 'Reference details' : 'Source URL'}>
          <div className="external-step"><span>01</span><p>{draft ? 'Source saved in your draft' : 'Begin with the original source'}</p>{draft && <Check size={15} />}</div>
          {!draft ? <form onSubmit={fetchPreview} noValidate>
            <label htmlFor="external-url">Paste URL</label>
            <input ref={urlInput} id="external-url" type="url" value={url} onChange={(event) => { setUrl(event.target.value); setError(''); }} placeholder="https://pinterest.com/..." required maxLength={4096} autoComplete="url" spellCheck={false} aria-invalid={!!error} aria-describedby={error ? 'external-error external-url-hint' : 'external-url-hint'} />
            <p className="external-helper" id="external-url-hint">Or paste an Instagram post, portfolio, or public artwork page.</p>
            {error && <p className="external-error" id="external-error" role="alert">{error}</p>}
            <div className="external-actions"><button className="external-primary" type="submit" disabled={busy}>{busy ? 'Preparing Preview…' : 'Fetch Reference'} <ArrowRight size={16} /></button><Link className="external-secondary" to="/explore">Cancel</Link></div>
            <div className="external-supported"><p className="eyebrow">Keep inspiration from</p><ul>{supported.map((source) => <li key={source}>{source}</li>)}</ul></div>
            <p className="external-helper">Preview extraction is not connected yet. You can save a link and add its details yourself.</p>
          </form> : <form onSubmit={save}>
            <label htmlFor="external-source">Original Source URL</label><input id="external-source" value={draft.source_url} readOnly />
            <button className="external-inline-button" type="button" onClick={() => reset(false)}>Change source</button>
            <div className="external-step external-step-details"><span>02</span><p>Make it easy to find again</p><small>Optional</small></div>
            <p className="external-notice" role="status">Placeholder preview — details have not been fetched from the source. Add or correct them below.</p>
            <label htmlFor="external-title">Reference Title</label><input ref={titleInput} id="external-title" value={draft.title} maxLength={200} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Dramatic portrait reference" />
            <div className="external-field-pair"><div><label htmlFor="external-creator">Creator Name</label><input id="external-creator" value={draft.creator_name} maxLength={160} onChange={(event) => update('creator_name', event.target.value)} placeholder="Credit the original creator" /></div><div><label htmlFor="external-platform">Source Platform</label><select id="external-platform" value={draft.source_platform} onChange={(event) => setDraft({ ...draft, source_platform: event.target.value as SourcePlatform })}>{sourcePlatforms.map((platform) => <option key={platform}>{platform}</option>)}</select></div></div>
            <label htmlFor="external-description">Description / Notes</label><textarea id="external-description" value={draft.description} maxLength={4000} rows={3} onChange={(event) => update('description', event.target.value)} placeholder="What caught your eye?" />
            <p className="external-helper">Optional details can be left blank. The original link is always kept.</p>
            {error && <p className="external-error" role="alert">{error}</p>}
            <div className="external-actions"><button className="external-primary" type="submit">Save Reference <ArrowRight size={16} /></button><Link className="external-secondary" to="/explore">Cancel</Link></div>
            <p className="external-storage-note"><LockKeyhole size={13} /> Private · Saved only in this browser</p>
          </form>}
        </section>
        <aside className="external-preview-column" aria-label="Reference preview"><p className="eyebrow">{draft ? 'Your reference, at a glance' : 'A little space for inspiration'}</p>
          {draft ? <ExternalReferencePreview reference={draft} /> : <div className="external-empty-preview"><span className="external-chip">External Reference</span><div className="external-placeholder-mark" aria-hidden="true"><Link2 size={40} strokeWidth={1} /></div><h2>A link worth<br /><em>coming back to.</em></h2><p>Your preview will appear here.<br />A missing image never gets in the way.</p><div className="external-preview-rule"><span>Original source</span><span>Always preserved ↗</span></div></div>}
          <div className="external-rights-note"><p className="eyebrow">Keep the creator in the picture</p><p>Finding an image online does not automatically grant permission to reproduce, publish, sell, or redistribute it.</p><small>Rights Unknown by default. Recommended for private study unless you verify the original creator's usage terms.</small></div>
        </aside>
      </div>
    </>}
  </div></AppShell>;
}
