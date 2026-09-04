import { useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { referenceStudies } from '../data/atelier-data';
import { getPracticeGuidance } from '../lib/practiceStudy';
import { getMaterialReadiness } from '../lib/artBox';
import { useArtBox } from '../components/ArtBoxProvider';
import { StuckAssistant } from '../components/StuckAssistant';
import { WipCritique } from '../components/WipCritique';

type ValueMode = 0 | 3 | 5;

export function PracticeWorkspace() {
  const { studyId } = useParams();
  const study = useMemo(() => referenceStudies.find((item) => item.id === studyId), [studyId]);
  const [zoom, setZoom] = useState(100);
  const [flipped, setFlipped] = useState(false);
  const [crop, setCrop] = useState(false);
  const [grid, setGrid] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [valueMode, setValueMode] = useState<ValueMode>(0);
  const [blur, setBlur] = useState(false);
  const [guidanceVisible, setGuidanceVisible] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickedColour, setPickedColour] = useState('#C98A70');
  const [stuckOpen, setStuckOpen] = useState(false);
  const [wipCritiqueOpen, setWipCritiqueOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const { ownedMaterials } = useArtBox();

  if (!study) return <main className="practice-not-found"><p className="eyebrow">Reference unavailable</p><h1>This study has moved.</h1><Link to="/explore">Return to the reference desk</Link></main>;

  const guidance = getPracticeGuidance(study);
  const materialReadiness = getMaterialReadiness(study, ownedMaterials);
  const imageFilter = `${grayscale || valueMode ? 'grayscale(1)' : ''} ${valueMode === 3 ? 'contrast(1.75) brightness(1.02)' : ''} ${valueMode === 5 ? 'contrast(1.28) brightness(1.03)' : ''} ${blur ? 'blur(3px)' : ''}`.trim() || 'none';
  const imageTransform = `scale(${(zoom / 100) * (crop ? 1.14 : 1)}) scaleX(${flipped ? -1 : 1})`;
  const pickColour = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!pickerOpen) return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const image = imageRef.current;
    if (image?.naturalWidth) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(image, 0, 0, width, height);
          const pixel = context.getImageData(Math.floor(event.clientX - left), Math.floor(event.clientY - top), 1, 1).data;
          setPickedColour(`#${[pixel[0], pixel[1], pixel[2]].map((channel) => channel.toString(16).padStart(2, '0')).join('').toUpperCase()}`);
          return;
        }
      } catch {
        // Cross-origin images can deny canvas sampling; use the study palette below.
      }
    }
    const palette = guidance.palette;
    const index = Math.min(palette.length - 1, Math.floor(((event.clientX - left) / width + (event.clientY - top) / height) * palette.length / 2));
    setPickedColour(palette[Math.max(0, index)].hex);
  };
  const toggleValueMode = (mode: Exclude<ValueMode, 0>) => setValueMode((current) => current === mode ? 0 : mode);
  const enterFullscreen = () => { if (document.fullscreenElement) document.exitFullscreen?.(); else document.documentElement.requestFullscreen?.(); };

  return <main className={`practice-workspace ${guidanceVisible ? '' : 'guidance-hidden'}`}>
    <header className="practice-header"><Link to="/explore" className="practice-back">← Reference desk</Link><div><p className="eyebrow">Practice workspace</p><h1>{study.title}</h1></div><button className="guidance-toggle" onClick={() => setGuidanceVisible((visible) => !visible)}>{guidanceVisible ? 'Hide guidance' : 'Show guidance'}</button></header>
    {guidanceVisible && <section className="study-ribbon" aria-label="Study details"><div><span>Difficulty</span><strong>{study.difficulty}</strong></div><div><span>Recommended medium</span><strong>{study.medium}</strong></div><div><span>Practice time</span><strong>{study.time}</strong></div><div><span>Skills covered</span><strong>{study.skills.join(' · ')}</strong></div></section>}
    <div className="practice-stage">
      <aside className="image-tools" aria-label="Reference image tools">
        <div className="tool-group"><button aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(70, value - 10))}>−</button><button aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(160, value + 10))}>+</button></div>
        <button aria-pressed={crop} onClick={() => setCrop((value) => !value)}>Crop</button><button aria-pressed={flipped} onClick={() => setFlipped((value) => !value)}>Flip horizontally</button><button aria-pressed={grid} onClick={() => setGrid((value) => !value)}>Grid overlay</button><button aria-pressed={grayscale} onClick={() => setGrayscale((value) => !value)}>Grayscale</button><button aria-pressed={valueMode === 3} onClick={() => toggleValueMode(3)}>3-value mode</button><button aria-pressed={valueMode === 5} onClick={() => toggleValueMode(5)}>5-value mode</button><button aria-pressed={pickerOpen} onClick={() => setPickerOpen((value) => !value)}>Colour picker</button><button aria-pressed={blur} onClick={() => setBlur((value) => !value)}>Blur details</button><button onClick={enterFullscreen}>Full screen</button><button aria-pressed={notesOpen} onClick={() => setNotesOpen((value) => !value)}>Reference notes</button><button className="stuck-trigger" onClick={() => setStuckOpen(true)}>I’m Stuck</button><button className="progress-trigger" onClick={() => setWipCritiqueOpen(true)}>Check My Progress</button>
      </aside>
      <section className="reference-canvas" aria-label="Reference image canvas">
        <div className={`reference-frame ${crop ? 'crop-active' : ''} ${grid ? 'grid-active' : ''}`} onClick={pickColour}>
          <img ref={imageRef} crossOrigin="anonymous" src={study.imageUrl} alt={study.alt} data-flipped={flipped} data-cropped={crop} style={{ filter: imageFilter, transform: imageTransform }} />
          {pickerOpen && <p className="picker-hint">Click anywhere on the reference to pull a study colour.</p>}
          {grid && <span className="reference-grid-lines" aria-hidden="true" />}
        </div>
        <div className="canvas-caption"><span>{zoom}% zoom</span>{pickerOpen && <span className="picked-colour"><i style={{ background: pickedColour }} /> {pickedColour}</span>}{crop && <span>Crop view on</span>}</div>
      </section>
      {guidanceVisible && <aside className="practice-guidance" aria-label="Study guidance"><section><p className="eyebrow">Optional objective</p><p>{guidance.objective}</p></section><section><p className="eyebrow">Suggested materials</p><ul>{guidance.materials.map((material) => <li key={material}>{material}</li>)}</ul></section><section className="material-readiness"><p className="eyebrow">My Art Box</p><strong>{materialReadiness.missing.length ? `You are missing ${materialReadiness.missing[0]}.` : 'You already own everything needed.'}</strong>{materialReadiness.alternatives.map((alternative) => <p key={alternative}>{alternative}</p>)}<Link to="/art-box">Update My Art Box ↗</Link></section><section><p className="eyebrow">Suggested palette</p><div className="palette-swatches">{guidance.palette.map((colour) => <span key={colour.name} title={`${colour.name}: ${colour.hex}`} style={{ background: colour.hex }} />)}</div></section><section className="licensing"><p className="eyebrow">Reference rights</p><strong>{study.licensing.badges.join(' · ')}</strong><p>{study.licensing.licence}</p><p>{study.licensing.attribution}</p><small>Source: {study.licensing.originalSource} · {study.licensing.creator}</small></section></aside>}
    </div>
    <div className="workspace-next-steps"><Link to={`/palette-lab/${study.id}`}>Open Palette Lab <span>↗</span></Link><Link className="finish-practice" to={`/compare/${study.id}`}>Finish practice <span>↗</span></Link></div>
    {notesOpen && <section className="reference-notes"><label htmlFor="reference-notes">Reference notes</label><textarea id="reference-notes" placeholder="What do you notice before you begin?" /></section>}
    {stuckOpen && <StuckAssistant study={study} onClose={() => setStuckOpen(false)} />}
    {wipCritiqueOpen && <WipCritique study={study} onClose={() => setWipCritiqueOpen(false)} />}
  </main>;
}
