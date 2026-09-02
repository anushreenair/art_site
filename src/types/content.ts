export type ArtCategory = {
  id: string;
  label: string;
  imageUrl: string;
  alt: string;
};

export type Artwork = {
  id: string;
  title: string;
  artist: string;
  medium: string;
  imageUrl: string;
  alt: string;
  saved?: boolean;
};

export type Practice = {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  imageUrl: string;
};

export type Opportunity = {
  id: string;
  title: string;
  organisation: string;
  date: string;
  location: string;
  type: string;
};

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Subject = 'Portrait' | 'Landscape' | 'Flowers' | 'Animals' | 'Architecture' | 'Still Life' | 'Human Figure' | 'Hands' | 'Eyes' | 'Nature' | 'Objects' | 'Abstract';
export type Medium = 'Oil Painting' | 'Acrylic' | 'Watercolour' | 'Gouache' | 'Pencil' | 'Colored Pencil' | 'Chalk' | 'Charcoal' | 'Pastel' | 'Ink' | 'Mixed Media';
export type Skill = 'Lighting' | 'Skin Tones' | 'Perspective' | 'Colour Mixing' | 'Texture' | 'Composition' | 'Values' | 'Shadows' | 'Proportions' | 'Anatomy' | 'Brush Control' | 'Edges' | 'Depth' | 'Contrast';
export type StudyTime = '5 minutes' | '10 minutes' | '20 minutes' | '30 minutes' | '45 minutes' | '1 hour' | '2 hours' | 'Long Study';

export type ReferenceStudy = { id: string; title: string; imageUrl: string; alt: string; subject: Subject; difficulty: Difficulty; medium: Medium; time: StudyTime; skills: Skill[]; attempts: number; rights: 'Public domain' | 'Artist licensed' | 'Practice reference' };
