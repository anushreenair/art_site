import { referenceStudies } from './atelier-data';

const challengeStudies = ['ref-portrait-two', 'ref-architecture-two', 'ref-animals', 'ref-still-life', 'ref-landscape'].map((id) => referenceStudies.find((study) => study.id === id)!);

const titles = ['45-Minute Dramatic Portrait', '45-Minute Sunlit Corridor', '45-Minute Quiet Animal Study', '45-Minute One-Lamp Still Life', '45-Minute Weather Study'];

export const weeklyThemes = ['Portrait Week', 'Watercolour Week', 'Light & Shadow Week', 'Architecture Week', 'Animal Week', 'Master Studies Week', 'Still Life Week', 'Colour Week'];

export function getDailyChallenge(date = new Date()) {
  const index = (date.getDate() + date.getMonth() * 3) % challengeStudies.length;
  const reference = challengeStudies[index];
  return { id: `daily-${index}`, title: titles[index], reference, participants: [1826, 944, 1317, 2084, 768][index], theme: weeklyThemes[Math.floor((date.getDate() - 1) / 7) % weeklyThemes.length], mainSkill: reference.skills[0] };
}

export const challengeHistory = [
  { day: 'Yesterday', title: 'Small shifts in blue', result: 'Completed', score: '20 min' },
  { day: 'Monday', title: 'A hand holding light', result: 'Completed', score: '30 min' },
  { day: 'Sunday', title: 'Leaf-shadow notes', result: 'Saved', score: '10 min' },
];
