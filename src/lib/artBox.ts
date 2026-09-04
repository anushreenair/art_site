import type { ReferenceStudy } from '../types/content';

export const artBoxCategories = ['Paint Colours', 'Brushes', 'Pencils', 'Charcoal', 'Pastels', 'Paper', 'Canvas', 'Ink', 'Markers', 'Other Materials'] as const;
export type ArtBoxCategory = (typeof artBoxCategories)[number];
export type ArtBoxMaterial = { name: string; category: ArtBoxCategory };

export const artBoxMaterials: ArtBoxMaterial[] = [
  { name: 'Ultramarine', category: 'Paint Colours' }, { name: 'Burnt Sienna', category: 'Paint Colours' }, { name: 'Yellow Ochre', category: 'Paint Colours' }, { name: 'Crimson', category: 'Paint Colours' }, { name: 'Sap Green', category: 'Paint Colours' }, { name: 'Titanium White', category: 'Paint Colours' }, { name: 'Viridian', category: 'Paint Colours' }, { name: 'Payne’s Grey', category: 'Paint Colours' },
  { name: 'Round brush', category: 'Brushes' }, { name: 'Flat brush', category: 'Brushes' }, { name: 'Small filbert', category: 'Brushes' }, { name: 'Detail round', category: 'Brushes' },
  { name: 'HB pencil', category: 'Pencils' }, { name: '2B pencil', category: 'Pencils' }, { name: '4B pencil', category: 'Pencils' }, { name: 'Kneaded eraser', category: 'Pencils' },
  { name: 'Willow charcoal', category: 'Charcoal' }, { name: 'Compressed charcoal', category: 'Charcoal' },
  { name: 'Soft pastels', category: 'Pastels' }, { name: 'White pastel pencil', category: 'Pastels' },
  { name: 'Watercolour paper', category: 'Paper' }, { name: 'Sketchbook paper', category: 'Paper' }, { name: 'Toned paper', category: 'Paper' },
  { name: 'Stretched canvas', category: 'Canvas' }, { name: 'Canvas panel', category: 'Canvas' },
  { name: 'Waterproof ink', category: 'Ink' }, { name: 'Brush pen', category: 'Ink' },
  { name: 'Alcohol markers', category: 'Markers' }, { name: 'Fine liner set', category: 'Markers' },
  { name: 'Mixing palette', category: 'Other Materials' }, { name: 'Water jar', category: 'Other Materials' }, { name: 'Stay-wet palette', category: 'Other Materials' },
];

export const defaultOwnedMaterials = artBoxMaterials.filter(({ name }) => name !== 'Viridian' && name !== 'Payne’s Grey' && name !== 'Canvas panel' && name !== 'Compressed charcoal' && name !== 'White pastel pencil' && name !== 'Alcohol markers' && name !== 'Fine liner set').map(({ name }) => name);

const mediumNeeds: Record<ReferenceStudy['medium'], string[]> = {
  'Oil Painting': ['Small filbert', 'Stretched canvas', 'Titanium White', 'Yellow Ochre', 'Burnt Sienna'],
  Acrylic: ['Flat brush', 'Stay-wet palette', 'Water jar', 'Stretched canvas', 'Titanium White', 'Ultramarine', 'Yellow Ochre'],
  Watercolour: ['Round brush', 'Watercolour paper', 'Ultramarine', 'Burnt Sienna', 'Yellow Ochre', 'Titanium White'],
  Gouache: ['Round brush', 'Watercolour paper', 'Mixing palette', 'Titanium White', 'Ultramarine'],
  Pencil: ['HB pencil', '2B pencil', 'Kneaded eraser', 'Sketchbook paper'],
  'Colored Pencil': ['HB pencil', 'Sketchbook paper', 'Kneaded eraser'],
  Chalk: ['Toned paper', 'White pastel pencil'],
  Charcoal: ['Willow charcoal', 'Kneaded eraser', 'Toned paper'],
  Pastel: ['Soft pastels', 'Toned paper'],
  Ink: ['Brush pen', 'Waterproof ink', 'Sketchbook paper'],
  'Mixed Media': ['Mixing palette', 'Sketchbook paper', 'Fine liner set'],
};

export function getMaterialReadiness(study: ReferenceStudy, ownedMaterials: string[]) {
  const required = [...mediumNeeds[study.medium], ...(study.subject === 'Nature' ? ['Viridian'] : [])];
  const owned = new Set(ownedMaterials);
  const missing = required.filter((item) => !owned.has(item));
  const alternatives = missing.flatMap((item) => item === 'Viridian' && owned.has('Sap Green') && owned.has('Ultramarine') ? ['Use Sap Green with Ultramarine, cooled with a little Titanium White, instead.'] : []);
  return { required, missing, alternatives };
}
