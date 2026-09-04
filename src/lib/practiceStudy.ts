import type { Medium, ReferenceStudy } from '../types/content';

type PaletteColour = { name: string; hex: string };

const materialsByMedium: Record<Medium, string[]> = {
  'Oil Painting': ['Small filbert', 'Titanium white', 'Odourless solvent'],
  Acrylic: ['Flat brush', 'Stay-wet palette', 'Water jar'],
  Watercolour: ['Round brush', 'Cold-press paper', 'Two water jars'],
  Gouache: ['Round brush', 'Mixing tray', 'Hot-press paper'],
  Pencil: ['HB pencil', '2B pencil', 'Kneaded eraser'],
  'Colored Pencil': ['Layering pencil set', 'Colourless blender', 'Smooth paper'],
  Chalk: ['White chalk', 'Toned paper', 'Chamois cloth'],
  Charcoal: ['Willow charcoal', 'Newsprint pad', 'Kneaded eraser'],
  Pastel: ['Soft pastels', 'Toned paper', 'Paper towel'],
  Ink: ['Brush pen', 'Waterproof ink', 'Smooth sketchbook'],
  'Mixed Media': ['Acrylic ink', 'Graphite pencil', 'Heavyweight paper'],
};

const palettes: Record<ReferenceStudy['subject'], PaletteColour[]> = {
  Portrait: [{ name: 'Ivory', hex: '#f0dbbd' }, { name: 'Rosewood', hex: '#925b4d' }, { name: 'Deep umber', hex: '#372d2b' }, { name: 'Window blue', hex: '#a8c0c7' }],
  Landscape: [{ name: 'Cloud', hex: '#cfd4d4' }, { name: 'Blue hour', hex: '#426988' }, { name: 'Moss', hex: '#50654e' }, { name: 'Stone', hex: '#756f67' }],
  Flowers: [{ name: 'Petal', hex: '#e4a9ad' }, { name: 'Stem', hex: '#5b7653' }, { name: 'Pollen', hex: '#d9ad43' }, { name: 'Vase shadow', hex: '#7d8d98' }],
  Animals: [{ name: 'Fur light', hex: '#d1a671' }, { name: 'Warm brown', hex: '#75462e' }, { name: 'Olive', hex: '#6d724d' }, { name: 'Charcoal', hex: '#34302d' }],
  Architecture: [{ name: 'Concrete', hex: '#a6a4a0' }, { name: 'Sky', hex: '#7aa5be' }, { name: 'Graphite', hex: '#2e3130' }, { name: 'Light', hex: '#ede7d8' }],
  'Still Life': [{ name: 'Paper', hex: '#e7d9c4' }, { name: 'Terracotta', hex: '#bc6d4c' }, { name: 'Cast shadow', hex: '#454a4b' }, { name: 'Glass', hex: '#9bb7b3' }],
  'Human Figure': [{ name: 'Skin light', hex: '#d7a37b' }, { name: 'Ochre', hex: '#bd823d' }, { name: 'Violet shadow', hex: '#5e596e' }, { name: 'Charcoal', hex: '#282728' }],
  Hands: [{ name: 'Warm light', hex: '#e0af83' }, { name: 'Rose shadow', hex: '#9d6759' }, { name: 'Leaf', hex: '#647b54' }, { name: 'Graphite', hex: '#363636' }],
  Eyes: [{ name: 'Linen', hex: '#e6d4c2' }, { name: 'Iris', hex: '#567c91' }, { name: 'Lash', hex: '#302b2a' }, { name: 'Coral', hex: '#c87e70' }],
  Nature: [{ name: 'Sun', hex: '#d4ba6c' }, { name: 'Fern', hex: '#5f7956' }, { name: 'Forest', hex: '#29443d' }, { name: 'Mist', hex: '#c9d1c9' }],
  Objects: [{ name: 'Cream', hex: '#e5ddce' }, { name: 'Red clay', hex: '#bf5740' }, { name: 'Olive', hex: '#7f815d' }, { name: 'Ink', hex: '#252525' }],
  Abstract: [{ name: 'Vermilion', hex: '#dd5139' }, { name: 'Cobalt', hex: '#3653a9' }, { name: 'Ochre', hex: '#c88a31' }, { name: 'Black', hex: '#1e2222' }],
};

export function getPracticeGuidance(study: ReferenceStudy) {
  return {
    materials: materialsByMedium[study.medium],
    palette: palettes[study.subject],
    objective: `Notice ${study.skills.slice(0, 2).join(' and ').toLowerCase()} before you make the first mark.`,
  };
}
