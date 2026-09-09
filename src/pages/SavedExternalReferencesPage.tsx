import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { ExternalReferencePreview } from '../components/ExternalReferencePreview';
import { getExternalReferences, type ExternalReference } from '../lib/externalReferences';

export function SavedExternalReferencesPage() {
  const [state] = useState<{ references: ExternalReference[]; error: string }>(() => {
    try { return { references: getExternalReferences(), error: '' }; }
    catch { return { references: [], error: 'Saved references could not be read. Check browser storage and reload this page. Existing data has not been changed.' }; }
  });
  return <AppShell><div className="external-page">
    <div className="external-breadcrumb"><Link to="/explore"><ArrowLeft size={14} /> Reference desk</Link></div>
    <header className="external-heading external-saved-heading"><div><p className="eyebrow">Your studio / Saved links</p><h1>Saved References</h1><p>Original sources, kept close. These external references are private and saved only in this browser.</p></div><Link className="external-primary" to="/references/add"><Plus size={16} /> Add External Reference</Link></header>
    {state.error ? <p className="external-error" role="alert">{state.error}</p> : state.references.length ? <><p className="external-saved-count">{state.references.length} {state.references.length === 1 ? 'external reference' : 'external references'}</p><div className="external-saved-grid">{state.references.map((reference) => <ExternalReferencePreview key={reference.id} reference={reference} saved />)}</div></> : <section className="external-saved-empty"><p className="eyebrow">Your first saved link</p><h2>Keep something that makes you look twice.</h2><p>Save a public artwork page, even when a thumbnail is unavailable.</p><Link className="external-secondary" to="/references/add">Add From URL →</Link></section>}
  </div></AppShell>;
}
