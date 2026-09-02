import type { ArtCategory, Artwork, Opportunity, Practice, ReferenceStudy } from '../types/content';

const image = (id: string, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const categories: ArtCategory[] = [
  { id: 'portrait', label: 'Portrait', imageUrl: image('photo-1544005313-94ddf0286df2'), alt: 'Woman posed in warm window light' },
  { id: 'landscape', label: 'Landscape', imageUrl: image('photo-1470770841072-f978cf4d019e'), alt: 'Misty mountain valley' },
  { id: 'flowers', label: 'Flowers', imageUrl: image('photo-1497250681960-ef046c08a56e'), alt: 'Delicate green leaves' },
  { id: 'animals', label: 'Animals', imageUrl: image('photo-1517849845537-4d257902454a'), alt: 'Calm dog portrait' },
  { id: 'architecture', label: 'Architecture', imageUrl: image('photo-1487958449943-2429e8be8625'), alt: 'Modern concrete building' },
  { id: 'still-life', label: 'Still Life', imageUrl: image('photo-1586023492125-27b2c045efd7'), alt: 'Sculptural chair and vase' },
  { id: 'figure', label: 'Human Figure', imageUrl: image('photo-1534528741775-53994a69daeb'), alt: 'Studio figure portrait' },
  { id: 'hands', label: 'Hands', imageUrl: image('photo-1517841905240-472988babdf9'), alt: 'Hands holding a small flower' },
  { id: 'eyes', label: 'Eyes', imageUrl: image('photo-1534528741775-53994a69daeb'), alt: 'Close portrait with expressive eyes' },
  { id: 'nature', label: 'Nature', imageUrl: image('photo-1441974231531-c6227db76b6e'), alt: 'Sunlit forest path' },
  { id: 'objects', label: 'Objects', imageUrl: image('photo-1513519245088-0e12902e5a38'), alt: 'Ceramic object collection' },
  { id: 'abstract', label: 'Abstract', imageUrl: image('photo-1549490349-8643362247b5'), alt: 'Painted abstract color study' },
];

export const focusArtwork: Artwork = {
  id: 'amber-study', title: 'Amber Study', artist: 'Mina Vale', medium: 'oil on linen', imageUrl: image('photo-1513364776144-60967b0f800f', 1200), alt: 'Artist palette covered in warm oil paints', saved: true,
};

export const artworks: Artwork[] = [
  focusArtwork,
  { id: 'silence', title: 'Stillness in Blue', artist: 'Sora Lee', medium: 'gouache', imageUrl: image('photo-1519681393784-d120267933ba'), alt: 'Blue mountain landscape', saved: true },
  { id: 'form', title: 'Form in Light', artist: 'David Osei', medium: 'charcoal', imageUrl: image('photo-1494438639946-1ebd1d20bf85'), alt: 'Sunlit architectural interior' },
  { id: 'spring', title: 'First Spring', artist: 'Elena Sol', medium: 'watercolour', imageUrl: image('photo-1490750967868-88aa4486c946'), alt: 'Pink spring blossom branches', saved: true },
  { id: 'quiet-table', title: 'The Quiet Table', artist: 'Nora Chen', medium: 'oil pastel', imageUrl: image('photo-1495474472287-4d71bcdd2085'), alt: 'Coffee table with a cup and notebook' },
  { id: 'green-note', title: 'Green Note', artist: 'Mae Ito', medium: 'coloured pencil', imageUrl: image('photo-1501004318641-b39e6451bec6'), alt: 'Deep green leaves', saved: true },
];

export const currentLesson: Practice = {
  id: 'lesson-7', title: 'Edges that breathe', description: 'Let soft and lost edges make your portrait feel alive.', duration: '18 min remaining', level: 'Developing', imageUrl: image('photo-1547891654-e66ed7ebb968'),
};

export const recommendedPractice: Practice = {
  id: 'practice-light', title: 'One lamp, three values', description: 'A small still life for understanding the architecture of light.', duration: '25 min', level: 'Developing', imageUrl: image('photo-1503602642458-232111445657'),
};

export const challenge: Practice = {
  id: 'challenge-gesture', title: 'Draw the pause', description: 'Five gestural studies of someone resting, waiting, or thinking.', duration: '20 min', level: 'All levels', imageUrl: image('photo-1512316609839-ce289d3eba0a'),
};

export const opportunities: Opportunity[] = [
  { id: 'op-1', title: 'Open studio: small works', organisation: 'The Fern Room', date: 'Closes 16 September', location: 'London + online', type: 'Open call' },
  { id: 'op-2', title: 'Urban sketching weekend', organisation: 'Field Notes Club', date: '21–22 September', location: 'Bristol', type: 'Workshop' },
  { id: 'op-3', title: 'Autumn members exhibition', organisation: 'North Gallery', date: 'Closes 2 October', location: 'Manchester', type: 'Exhibition' },
];

export const referenceStudies: ReferenceStudy[] = [
  { id: 'ref-portrait', title: 'Window-light portrait', imageUrl: image('photo-1544005313-94ddf0286df2'), alt: 'Portrait in soft window light', subject: 'Portrait', difficulty: 'Beginner', medium: 'Pencil', time: '20 minutes', skills: ['Proportions', 'Values', 'Edges'], attempts: 1284, rights: 'Practice reference' },
  { id: 'ref-landscape', title: 'Blue hour valley', imageUrl: image('photo-1519681393784-d120267933ba'), alt: 'Mountain valley at blue hour', subject: 'Landscape', difficulty: 'Intermediate', medium: 'Gouache', time: '45 minutes', skills: ['Depth', 'Colour Mixing', 'Composition'], attempts: 946, rights: 'Artist licensed' },
  { id: 'ref-flowers', title: 'Tulips in a glass', imageUrl: image('photo-1490750967868-88aa4486c946'), alt: 'Pink flowers in bloom', subject: 'Flowers', difficulty: 'Beginner', medium: 'Watercolour', time: '20 minutes', skills: ['Brush Control', 'Colour Mixing', 'Texture'], attempts: 2218, rights: 'Practice reference' },
  { id: 'ref-animals', title: 'Quiet dog study', imageUrl: image('photo-1517849845537-4d257902454a'), alt: 'Dog resting in warm light', subject: 'Animals', difficulty: 'Intermediate', medium: 'Colored Pencil', time: '1 hour', skills: ['Texture', 'Values', 'Anatomy'], attempts: 751, rights: 'Artist licensed' },
  { id: 'ref-architecture', title: 'Concrete and sky', imageUrl: image('photo-1487958449943-2429e8be8625'), alt: 'Geometric concrete architecture', subject: 'Architecture', difficulty: 'Advanced', medium: 'Ink', time: '2 hours', skills: ['Perspective', 'Contrast', 'Composition'], attempts: 409, rights: 'Practice reference' },
  { id: 'ref-still-life', title: 'Three objects, one lamp', imageUrl: image('photo-1513519245088-0e12902e5a38'), alt: 'Ceramics arranged as a still life', subject: 'Still Life', difficulty: 'Beginner', medium: 'Charcoal', time: '30 minutes', skills: ['Lighting', 'Shadows', 'Values'], attempts: 1911, rights: 'Public domain' },
  { id: 'ref-figure', title: 'Resting figure', imageUrl: image('photo-1534528741775-53994a69daeb'), alt: 'Figure in a calm studio setting', subject: 'Human Figure', difficulty: 'Advanced', medium: 'Chalk', time: 'Long Study', skills: ['Anatomy', 'Proportions', 'Edges'], attempts: 383, rights: 'Artist licensed' },
  { id: 'ref-hands', title: 'Hand and stem', imageUrl: image('photo-1517841905240-472988babdf9'), alt: 'Hand holding a flower stem', subject: 'Hands', difficulty: 'Intermediate', medium: 'Pencil', time: '20 minutes', skills: ['Anatomy', 'Proportions', 'Shadows'], attempts: 1672, rights: 'Practice reference' },
  { id: 'ref-eyes', title: 'Eye in warm shadow', imageUrl: image('photo-1534528741775-53994a69daeb'), alt: 'Close portrait with expressive eyes', subject: 'Eyes', difficulty: 'Beginner', medium: 'Pastel', time: '10 minutes', skills: ['Skin Tones', 'Contrast', 'Edges'], attempts: 2038, rights: 'Practice reference' },
  { id: 'ref-nature', title: 'Forest rhythm', imageUrl: image('photo-1441974231531-c6227db76b6e'), alt: 'Forest path with shafts of sunlight', subject: 'Nature', difficulty: 'Intermediate', medium: 'Acrylic', time: '45 minutes', skills: ['Depth', 'Lighting', 'Texture'], attempts: 612, rights: 'Public domain' },
  { id: 'ref-objects', title: 'Red chair study', imageUrl: image('photo-1586023492125-27b2c045efd7'), alt: 'Sculptural chair and vase', subject: 'Objects', difficulty: 'Beginner', medium: 'Oil Painting', time: '30 minutes', skills: ['Composition', 'Colour Mixing', 'Shadows'], attempts: 1124, rights: 'Practice reference' },
  { id: 'ref-abstract', title: 'Colour weather', imageUrl: image('photo-1549490349-8643362247b5'), alt: 'Expressive abstract painted surface', subject: 'Abstract', difficulty: 'Intermediate', medium: 'Mixed Media', time: '1 hour', skills: ['Texture', 'Contrast', 'Brush Control'], attempts: 543, rights: 'Artist licensed' },
  { id: 'ref-portrait-two', title: 'Profile in coral', imageUrl: image('photo-1500648767791-00dcc994a43e'), alt: 'Side profile portrait', subject: 'Portrait', difficulty: 'Intermediate', medium: 'Oil Painting', time: '1 hour', skills: ['Skin Tones', 'Lighting', 'Values'], attempts: 827, rights: 'Artist licensed' },
  { id: 'ref-landscape-two', title: 'Cloud field', imageUrl: image('photo-1500534623283-312aade485b7'), alt: 'Open landscape beneath a broad sky', subject: 'Landscape', difficulty: 'Beginner', medium: 'Watercolour', time: '20 minutes', skills: ['Composition', 'Depth', 'Brush Control'], attempts: 1488, rights: 'Public domain' },
  { id: 'ref-flowers-two', title: 'Green stems', imageUrl: image('photo-1497250681960-ef046c08a56e'), alt: 'Layered green leaves', subject: 'Flowers', difficulty: 'Advanced', medium: 'Gouache', time: '2 hours', skills: ['Texture', 'Edges', 'Colour Mixing'], attempts: 364, rights: 'Practice reference' },
  { id: 'ref-objects-two', title: 'Morning cup', imageUrl: image('photo-1495474472287-4d71bcdd2085'), alt: 'Coffee cup and notebook on a table', subject: 'Objects', difficulty: 'Beginner', medium: 'Ink', time: '5 minutes', skills: ['Values', 'Contrast', 'Composition'], attempts: 2420, rights: 'Public domain' },
  { id: 'ref-architecture-two', title: 'Sunlit corridor', imageUrl: image('photo-1494438639946-1ebd1d20bf85'), alt: 'Light-filled architectural interior', subject: 'Architecture', difficulty: 'Intermediate', medium: 'Charcoal', time: '45 minutes', skills: ['Perspective', 'Lighting', 'Shadows'], attempts: 688, rights: 'Artist licensed' },
  { id: 'ref-nature-two', title: 'Leaf shadows', imageUrl: image('photo-1501004318641-b39e6451bec6'), alt: 'Layered green leaves in shadow', subject: 'Nature', difficulty: 'Beginner', medium: 'Colored Pencil', time: '10 minutes', skills: ['Texture', 'Contrast', 'Values'], attempts: 1742, rights: 'Practice reference' },
];
