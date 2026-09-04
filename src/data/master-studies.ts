export type MasterStudy = {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  image: string;
  alt: string;
  movement: string;
  analysis: { label: string; note: string }[];
  activities: { title: string; note: string; duration: string; studyId: string }[];
};

export const masterStudies: MasterStudy[] = [
  { id: 'vermeer-pearl', title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', year: 'c. 1665', medium: 'Oil on canvas', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Meisje_met_de_parel.jpg', alt: 'Girl with a Pearl Earring by Johannes Vermeer', movement: 'Dutch Golden Age · Public domain', analysis: [
    { label: 'Composition analysis', note: 'The head turns out of a dark field; the tiny pearl gives the eye a final place to land.' },
    { label: 'Lighting', note: 'One broad, cool light strikes the forehead and cheek, then falls away without becoming fussy.' },
    { label: 'Values', note: 'The image holds on a small value range. The brightest accents are rationed to the eye, lip, collar, and pearl.' },
    { label: 'Colour palette', note: 'Blue and yellow create the charge; the skin stays muted so the turban can sing.' },
    { label: 'Brushwork', note: 'Most forms are quietly blended, while the pearl is only a few decisive marks.' },
    { label: 'Edges', note: 'The far cheek and hair disappear into the background; the near eye and lip keep the sharper edges.' },
    { label: 'Focal point', note: 'Her turning gaze is the focal point, held by a small triangle of light between eye, mouth, and pearl.' },
  ], activities: [
    { title: 'Study only the shadows.', note: 'Paint the large shadow family as one connected shape. Leave the light untouched.', duration: '15 min', studyId: 'ref-portrait' },
    { title: 'Recreate the colour palette.', note: 'Mix four muted swatches: blue, yellow, skin-light, and background-dark.', duration: '20 min', studyId: 'ref-portrait-two' },
    { title: 'Paint one small section.', note: 'Choose the eye, mouth, or pearl. Work at a larger scale than the original detail.', duration: '25 min', studyId: 'ref-eyes' },
    { title: '15-Minute Value Study', note: 'Reduce the whole portrait to three values before adding any colour.', duration: '15 min', studyId: 'ref-portrait' },
  ] },
  { id: 'hokusai-wave', title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', year: 'c. 1831', medium: 'Woodblock print', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Great_Wave_off_Kanagawa.jpg', alt: 'The Great Wave off Kanagawa by Katsushika Hokusai', movement: 'Ukiyo-e · Public domain', analysis: [
    { label: 'Composition analysis', note: 'The wave makes a claw-shaped frame around the distant mountain, compressing drama and distance into one view.' },
    { label: 'Lighting', note: 'There is almost no modelling. Contrast is carried by silhouette, foam, and the flat pale sky.' },
    { label: 'Values', note: 'A deep blue foreground creates a quick path to the pale mountain and sky.' },
    { label: 'Colour palette', note: 'Prussian blue dominates, with off-white and warm paper tones keeping the print luminous.' },
    { label: 'Brushwork', note: 'Think in carved marks rather than painterly strokes: each contour is economical and intentional.' },
    { label: 'Edges', note: 'The wave has a hard, graphic contour; the foam softens only at its small breaking tips.' },
    { label: 'Focal point', note: 'Mount Fuji is small but perfectly placed inside the arch of the wave.' },
  ], activities: [
    { title: 'Trace the big motion.', note: 'Use three curved lines to find the wave’s direction before adding foam.', duration: '10 min', studyId: 'ref-landscape' },
    { title: 'Build a two-colour print.', note: 'Limit yourself to one blue and one pale paper value.', duration: '20 min', studyId: 'ref-landscape-two' },
    { title: 'Make the focal point tiny.', note: 'Use a small distant shape to anchor a much larger foreground action.', duration: '20 min', studyId: 'ref-landscape' },
  ] },
  { id: 'vangogh-night', title: 'The Starry Night', artist: 'Vincent van Gogh', year: '1889', medium: 'Oil on canvas', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/The_Starry_Night.jpeg', alt: 'The Starry Night by Vincent van Gogh', movement: 'Post-Impressionism · Public domain', analysis: [
    { label: 'Composition analysis', note: 'The cypress provides a dark vertical counterweight to the wide, moving sky.' },
    { label: 'Lighting', note: 'Light is invented as much as observed: the moon and stars pulse against thick blue movement.' },
    { label: 'Values', note: 'The dark village is quiet enough to make the sky feel physically active.' },
    { label: 'Colour palette', note: 'Blue-violet and yellow-orange form a vibrating complementary pair.' },
    { label: 'Brushwork', note: 'Direction is the subject: every stroke describes a current in the sky.' },
    { label: 'Edges', note: 'The moon stays round and firm while most sky edges loop and dissolve.' },
    { label: 'Focal point', note: 'The moon and brightest star act as anchors within the swirling sky.' },
  ], activities: [
    { title: 'Follow one brush direction.', note: 'Make every mark curve with the same imagined wind.', duration: '15 min', studyId: 'ref-abstract' },
    { title: 'Mix a night palette.', note: 'Create blue-violet, muted blue, warm yellow, and near-black.', duration: '20 min', studyId: 'ref-landscape' },
    { title: 'Paint sky over a quiet ground.', note: 'Keep the lower third simple so movement can live above it.', duration: '30 min', studyId: 'ref-landscape-two' },
  ] },
];
