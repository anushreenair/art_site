export type LearningLesson = { title: string; focus: string; duration: string; studyId: string };

export type LearningPath = {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  practiceCount: number;
  progress: number;
  colour: 'coral' | 'blue' | 'moss' | 'gold';
  lessons: LearningLesson[];
};

export const learningPaths: LearningPath[] = [
  { id: 'portrait', title: 'Learn Portrait Painting', subtitle: 'Build a face from clear decisions', level: 'Beginner → Intermediate', practiceCount: 10, progress: 30, colour: 'coral', lessons: [
    { title: 'Face Proportions', focus: 'Map the big distances before you describe features.', duration: '20 min', studyId: 'ref-portrait' },
    { title: 'Eyes', focus: 'Look for the socket shape, not just the outline.', duration: '15 min', studyId: 'ref-eyes' },
    { title: 'Nose', focus: 'Turn a simple plane with three values.', duration: '20 min', studyId: 'ref-portrait-two' },
    { title: 'Lips', focus: 'Keep the edges quieter than the expression.', duration: '15 min', studyId: 'ref-portrait-two' },
    { title: 'Skin Tones', focus: 'Mix temperature shifts before local colour.', duration: '30 min', studyId: 'ref-portrait-two' },
    { title: 'Hair', focus: 'Group the mass before drawing individual strands.', duration: '20 min', studyId: 'ref-portrait' },
    { title: 'Lighting', focus: 'Find the shadow family and keep it connected.', duration: '30 min', studyId: 'ref-portrait-two' },
    { title: 'Expressions', focus: 'Notice the tiny directional changes around the mouth.', duration: '20 min', studyId: 'ref-portrait' },
    { title: 'Three-Quarter Portrait', focus: 'Use the centre line to turn the head in space.', duration: '45 min', studyId: 'ref-portrait-two' },
    { title: 'Full Portrait', focus: 'Bring proportion, value, and personality into one study.', duration: '1 hour', studyId: 'ref-portrait-two' },
  ] },
  { id: 'watercolour', title: 'Beginner Watercolour', subtitle: 'Let water do some of the work', level: 'Beginner', practiceCount: 8, progress: 0, colour: 'blue', lessons: [
    { title: 'The first wash', focus: 'Find an even wash without overworking it.', duration: '10 min', studyId: 'ref-landscape-two' },
    { title: 'Soft edges', focus: 'Let two wet shapes meet and mingle.', duration: '15 min', studyId: 'ref-flowers' },
    { title: 'Simple colour mixing', focus: 'Make a small palette do more.', duration: '20 min', studyId: 'ref-abstract' },
    { title: 'Light against colour', focus: 'Reserve the paper for your clearest light.', duration: '30 min', studyId: 'ref-landscape-two' },
  ] },
  { id: 'perspective', title: 'Master Perspective', subtitle: 'Make space feel believable', level: 'Intermediate', practiceCount: 9, progress: 12, colour: 'moss', lessons: [
    { title: 'One-point rooms', focus: 'Set the horizon before the furniture.', duration: '20 min', studyId: 'ref-architecture-two' },
    { title: 'Measured angles', focus: 'Compare every slant to one reliable line.', duration: '25 min', studyId: 'ref-architecture' },
    { title: 'Depth with overlap', focus: 'Stack simple shapes before detail.', duration: '30 min', studyId: 'ref-architecture-two' },
  ] },
  { id: 'light', title: 'Understanding Light & Shadow', subtitle: 'See the value pattern first', level: 'All levels', practiceCount: 7, progress: 44, colour: 'gold', lessons: [
    { title: 'Three values', focus: 'Separate light, shadow, and accent.', duration: '15 min', studyId: 'ref-still-life' },
    { title: 'Cast shadows', focus: 'Follow the form and the light source.', duration: '20 min', studyId: 'ref-objects' },
    { title: 'Atmospheric light', focus: 'Let distant values come closer together.', duration: '30 min', studyId: 'ref-landscape' },
  ] },
  { id: 'colour', title: 'Colour Mixing Fundamentals', subtitle: 'Mix with intent, not guesswork', level: 'Beginner', practiceCount: 6, progress: 0, colour: 'coral', lessons: [
    { title: 'Warm and cool', focus: 'Find temperature in a limited palette.', duration: '15 min', studyId: 'ref-abstract' },
    { title: 'Muted colour', focus: 'Mix greys that still belong to the scene.', duration: '20 min', studyId: 'ref-landscape' },
    { title: 'Colour in shadow', focus: 'Keep the shadow family alive.', duration: '30 min', studyId: 'ref-portrait-two' },
  ] },
  { id: 'animals', title: 'Animal Drawing', subtitle: 'Structure before fur', level: 'Beginner → Intermediate', practiceCount: 8, progress: 0, colour: 'moss', lessons: [
    { title: 'The big silhouette', focus: 'Find the gesture in one line of action.', duration: '10 min', studyId: 'ref-animals' },
    { title: 'Volume and joints', focus: 'Simplify the body into connected forms.', duration: '25 min', studyId: 'ref-animals' },
    { title: 'Texture with restraint', focus: 'Place fur only where it changes the form.', duration: '30 min', studyId: 'ref-animals' },
  ] },
  { id: 'landscape', title: 'Landscape Painting', subtitle: 'Compose weather, depth, and place', level: 'Intermediate', practiceCount: 9, progress: 22, colour: 'blue', lessons: [
    { title: 'A clear focal path', focus: 'Choose where the eye enters the scene.', duration: '20 min', studyId: 'ref-landscape-two' },
    { title: 'Distance with colour', focus: 'Reduce contrast as the land recedes.', duration: '30 min', studyId: 'ref-landscape' },
    { title: 'A complete weather study', focus: 'Bring your value plan into a finished painting.', duration: '45 min', studyId: 'ref-landscape' },
  ] },
];
