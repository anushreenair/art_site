import type { Difficulty, Medium, Skill, StudyTime, Subject } from '../types/content';
import type { RightsFilter, StudyFilters } from '../lib/filterStudies';

type Option = Difficulty | Subject | Medium | Skill | StudyTime | RightsFilter;
type Group = { key: keyof StudyFilters; label: string; options: Option[] };

const groups: Group[] = [
  { key: 'difficulty', label: 'Difficulty', options: ['Beginner', 'Intermediate', 'Advanced'] },
  { key: 'subject', label: 'Subject', options: ['Portrait', 'Landscape', 'Flowers', 'Animals', 'Architecture', 'Still Life', 'Human Figure', 'Hands', 'Eyes', 'Nature', 'Objects', 'Abstract'] },
  { key: 'medium', label: 'Medium', options: ['Oil Painting', 'Acrylic', 'Watercolour', 'Gouache', 'Pencil', 'Colored Pencil', 'Chalk', 'Charcoal', 'Pastel', 'Ink', 'Mixed Media'] },
  { key: 'skill', label: 'Skill', options: ['Lighting', 'Skin Tones', 'Perspective', 'Colour Mixing', 'Texture', 'Composition', 'Values', 'Shadows', 'Proportions', 'Anatomy', 'Brush Control', 'Edges', 'Depth', 'Contrast'] },
  { key: 'time', label: 'Time', options: ['5 minutes', '10 minutes', '20 minutes', '30 minutes', '45 minutes', '1 hour', '2 hours', 'Long Study'] },
  { key: 'rights', label: 'Usage rights', options: ['Can Sell Resulting Artwork', 'Can Publish Online', 'Practice Only', 'Public Domain'] },
];

type Props = { filters: StudyFilters; onToggle: (key: keyof StudyFilters, value: string) => void; onClear: () => void };

export function ReferenceFilters({ filters, onToggle, onClear }: Props) {
  const activeCount = Object.values(filters).flat().length;
  return <aside className="reference-filters" aria-label="Filter references"><div className="filter-heading"><p className="eyebrow">Find a precise study</p><h2>Filters</h2>{activeCount > 0 && <button className="clear-filters" onClick={onClear}>Clear all</button>}</div>{groups.map((group) => <details key={group.key} open><summary>{group.label}<span>{filters[group.key].length || ''}</span></summary><div className="filter-options">{group.options.map((option) => { const selected = (filters[group.key] as string[]).includes(option); return <button key={option} aria-pressed={selected} className={selected ? 'active' : ''} onClick={() => onToggle(group.key, option)}>{option}</button>; })}</div></details>)}</aside>;
}
