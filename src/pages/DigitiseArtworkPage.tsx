import { useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';

const corrections = ['Perspective Correction', 'Canvas Detection', 'Crop', 'Lighting Correction', 'White Balance', 'Background Cleanup', 'Colour Comparison'] as const;
type Correction = typeof corrections[number];
const exports = ['Portfolio Export', 'Social Media Export', 'High-Resolution Export'] as const;

export function DigitiseArtworkPage() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('');
  const [enabled, setEnabled] = useState<Record<Correction, boolean>>(() => Object.fromEntries(corrections.map((correction) => [correction, false])) as Record<Correction, boolean>);
  const [rotation, setRotation] = useState(0);
  const [exportReady, setExportReady] = useState<string | null>(null);
  const preview = photoUrl ?? 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85';

  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);
  const uploadPhoto = (file: File | undefined) => { if (!file) return; if (photoUrl) URL.revokeObjectURL(photoUrl); setPhotoUrl(URL.createObjectURL(file)); setPhotoName(file.name); setExportReady(null); };
  const toggle = (correction: Correction) => { setEnabled((current) => ({ ...current, [correction]: !current[correction] })); setExportReady(null); };

  return <AppShell><main className="digitise-page">
    <section className="digitise-hero"><div><p className="eyebrow">Artwork documentation desk</p><h1 aria-label="Digitise my artwork">Digitise<br /><em>my artwork.</em></h1></div><div><p>Make a faithful photograph that is ready for a portfolio, an application, or a share—without changing the work you made.</p><strong>This tool does not alter or regenerate your artwork.</strong></div></section>
    <section className="digitise-workbench" aria-label="Artwork photography workspace">
      <aside className="digitise-controls"><label className="digitise-upload" htmlFor="artwork-photo"><span>Upload an artwork photograph</span><input id="artwork-photo" aria-label="Upload an artwork photograph" type="file" accept="image/*" onChange={(event) => uploadPhoto(event.target.files?.[0])} /><small>{photoName || 'JPEG, PNG, or HEIC'}</small></label><div className="correction-controls"><p className="eyebrow">Photograph adjustments</p>{corrections.map((correction) => <button key={correction} aria-label={correction} aria-pressed={enabled[correction]} onClick={() => toggle(correction)}>{correction}<span aria-hidden="true">{enabled[correction] ? '✓' : '+'}</span></button>)}<button className="rotate-control" onClick={() => { setRotation((current) => (current + 90) % 360); setExportReady(null); }}>Rotate 90° <span>↻</span></button></div></aside>
      <section className="digitise-preview-wrap"><header><p className="eyebrow">Documentation preview</p><span>{photoName || 'Sample artwork photograph'}</span></header><figure className={`digitise-preview ${enabled['Canvas Detection'] ? 'detecting-canvas' : ''} ${enabled.Crop ? 'cropped-photo' : ''} ${enabled['Background Cleanup'] ? 'clean-background' : ''}`} aria-label="Artwork photograph preview" data-perspective={enabled['Perspective Correction']}><img src={preview} alt="Artwork photograph documentation preview" style={{ transform: `rotate(${rotation}deg) scale(${enabled.Crop ? 1.12 : 1})`, filter: `${enabled['Lighting Correction'] ? 'brightness(1.09) contrast(1.04)' : 'none'} ${enabled['White Balance'] ? 'sepia(.05) saturate(.94)' : ''}` }} />{enabled['Perspective Correction'] && <i className="perspective-guide" aria-hidden="true" />}{enabled['Canvas Detection'] && <b className="canvas-guide" aria-hidden="true">Canvas found</b>}</figure>{enabled['Colour Comparison'] && <div className="colour-comparison"><span><i /> Original capture</span><span><i /> Documentation preview</span></div>}<p className="preview-note">Adjustments refine the photograph’s framing and neutrality. They never paint, erase, or regenerate the artwork.</p></section>
      <aside className="digitise-export"><p className="eyebrow">Deliver the photograph</p><h2>Export with the right context.</h2><p>Choose a preset after you have checked edges, lighting, and the canvas background.</p><div>{exports.map((option) => <button key={option} aria-label={option} onClick={() => setExportReady(`${option.replace('Export', '').trim()} export is ready to download.`)}>{option}<span aria-hidden="true">↗</span></button>)}</div>{exportReady && <p className="export-ready" role="status">{exportReady}</p>}<small>Export presets are structured for a future high-resolution photo processing service.</small></aside>
    </section>
  </main></AppShell>;
}
