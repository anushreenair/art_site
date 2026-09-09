export type ReferencePackView = {
  id: string;
  label: string;
  study: string;
  insight: string;
  image: string;
  alt: string;
};

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=85`;

export const portraitReferencePack: ReferencePackView[] = [
  { id: 'front', label: 'Front View', study: 'Face proportions & placement', insight: 'Map the centre line, eye line, and the width of the features before you chase a likeness.', image: image('photo-1544005313-94ddf0286df2'), alt: 'Front-facing portrait in soft window light' },
  { id: 'three-quarter', label: 'Three-Quarter View', study: 'Turning form in space', insight: 'Watch where the far eye narrows and where the nose begins to overlap the cheek.', image: image('photo-1534528741775-53994a69daeb'), alt: 'Portrait turned three quarters toward the light' },
  { id: 'profile', label: 'Profile', study: 'Silhouette & structure', insight: 'Use the profile to understand how brow, nose, lips, and chin sit on a single directional rhythm.', image: image('photo-1500648767791-00dcc994a43e'), alt: 'Profile portrait lit from one side' },
  { id: 'eye', label: 'Eye Close-Up', study: 'Lids, planes & edges', insight: 'The eye is set into the socket: soften the lid edge and reserve your sharpest contrast for the iris.', image: image('photo-1517841905240-472988babdf9'), alt: 'Portrait detail with expressive eyes' },
  { id: 'skin', label: 'Skin Detail', study: 'Temperature shifts', insight: 'Look for warm cheeks against cooler shadow planes rather than trying to match one local skin colour.', image: image('photo-1531123897727-8f129e1688ce'), alt: 'Portrait detail in warm window light' },
  { id: 'hair', label: 'Hair Detail', study: 'Mass before strands', insight: 'Paint the large light and shadow shapes first; only add a few directional strands at the end.', image: image('photo-1519085360753-af0119f7cbe7'), alt: 'Portrait with textured hair in side light' },
  { id: 'light', label: 'Lighting Diagram', study: 'Light direction & shadow family', insight: 'Separate the light side from the shadow side. Reflected light stays quieter than the direct light.', image: image('photo-1513364776144-60967b0f800f'), alt: 'Portrait study lit with a single soft source' },
  { id: 'gray', label: 'Grayscale Reference', study: 'Values before colour', insight: 'Squint until the portrait becomes three broad value families: light, halftone, and shadow.', image: image('photo-1544005313-94ddf0286df2'), alt: 'Grayscale portrait reference' },
  { id: 'palette', label: 'Palette Study', study: 'A restrained colour key', insight: 'Begin with a limited set of warm and cool mixtures. Let value do more work than saturation.', image: image('photo-1513364776144-60967b0f800f'), alt: 'Warm portrait colour palette on an artist palette' },
  { id: 'value', label: 'Value Study', study: 'Five clear values', insight: 'Group the detail into five deliberate steps before moving toward colour or texture.', image: image('photo-1547891654-e66ed7ebb968'), alt: 'Monochrome portrait value study' },
];
