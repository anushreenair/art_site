import { useState, type MouseEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { referenceStudies } from '../data/atelier-data';
import { getPaletteReadings } from '../lib/paletteLab';

const variations = [{ key: 'lighter', label: 'Lighter version' }, { key: 'darker', label: 'Darker version' }, { key: 'saturated', label: 'More saturated' }, { key: 'muted', label: 'More muted' }] as const;

export function PaletteLabPage() {
  const { studyId } = useParams();
  const study = referenceStudies.find((item) => item.id === studyId);
  const readings = study ? getPaletteReadings(study) : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  if (!study) return <AppShell><section className="palette-not-found"><p className="eyebrow">Palette unavailable</p><h1>Choose a reference first.</h1><Link to="/explore">Return to the reference desk</Link></section></AppShell>;
  const selected = readings[selectedIndex];
  const chooseColour = (event: MouseEvent<HTMLButtonElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const next = width ? Math.min(readings.length - 1, Math.max(0, Math.floor(((event.clientX - left) / width) * readings.length))) : (selectedIndex + 1) % readings.length;
    setSelectedIndex(next);
  };
  return <AppShell><section className="palette-lab"><header className="palette-lab-header"><Link to={`/practice/${study.id}`}>← Back to workspace</Link><div><p className="eyebrow">Reference-aware colour study</p><h1>Palette Lab</h1></div><p>Tap a visual note, then use the mix as a starting conversation with your paint—not a recipe to obey.</p></header><div className="palette-lab-stage"><section className="palette-reference-wrap"><p className="eyebrow">Choose from the reference</p><button className="palette-reference" aria-label="Choose a colour from the reference" onClick={chooseColour}><img src={study.imageUrl} alt={study.alt} /><span className="palette-pin" style={{ left: `${18 + selectedIndex * 23}%`, top: `${35 + (selectedIndex % 2) * 29}%` }} aria-hidden="true" /><span className="palette-pick-hint">Tap the image to read another colour</span></button><p className="palette-reference-caption">Current selection: <strong>{selected.name}</strong></p></section><aside className="palette-reading" aria-live="polite"><div className="target-colour"><span style={{ background: selected.hex }} aria-hidden="true" /><div><p className="eyebrow">Target colour</p><h2>{selected.name}</h2><p>{selected.hex.toUpperCase()}</p></div></div><section><p className="eyebrow">Suggested paint mix</p><ul>{selected.mix.map((paint) => <li key={paint}>{paint}</li>)}</ul></section><section className="bias-reading"><p className="eyebrow">Warm / cool bias</p><p>{selected.bias}</p></section><section className="palette-variations" aria-label="Colour variations">{variations.map((variation) => <div key={variation.key}><span style={{ background: selected[variation.key] }} aria-hidden="true" /><small>{variation.label}</small></div>)}</section></aside></div><footer className="palette-caveat"><span>✦</span><p><strong>Pigment results vary.</strong> Brand, pigment, surface, medium, and lighting will all change what appears on the page. Mix a small test first, then adjust with your own eyes.</p><Link className="button button-dark" to={`/practice/${study.id}`}>Return to Practice <span>↗</span></Link></footer></section></AppShell>;
}
