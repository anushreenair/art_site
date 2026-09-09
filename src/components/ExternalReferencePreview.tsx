import { ArrowUpRight, Link2, LockKeyhole } from 'lucide-react';
import type { ReferenceDraft } from '../lib/externalReferences';

export function ExternalReferencePreview({ reference, saved = false }: { reference: ReferenceDraft; saved?: boolean }) {
  return <article className="external-preview" aria-label={reference.title || 'Untitled reference'}>
    <div className="external-preview-image">
      <span className="external-chip">External Reference</span>
      <div className="external-placeholder-mark" aria-hidden="true"><Link2 size={38} strokeWidth={1} /></div>
      <p>{reference.source_platform}</p>
      <small>Thumbnail unavailable</small>
      <span className="external-placeholder-note">The artwork stays with its creator.</span>
    </div>
    <div className="external-preview-body">
      <div className="external-preview-meta"><span>Source: {reference.source_platform}</span><span><LockKeyhole size={12} /> Private</span></div>
      <h2>{reference.title || 'Untitled reference'}</h2>
      <p className="external-credit">{reference.creator_name ? `Reference by ${reference.creator_name}` : 'Creator not yet added'}</p>
      {reference.description && <p className="external-description">{reference.description}</p>}
      <a className="external-original" href={reference.source_url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">View Original <ArrowUpRight size={16} /><small>{new URL(reference.source_url).hostname}</small></a>
      <div className="external-card-footer"><span>Rights Unknown</span><small>{saved ? 'Saved as a link only' : 'Link-only preview'}</small></div>
    </div>
  </article>;
}
