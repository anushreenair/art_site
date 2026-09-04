import type { ReferenceStudy } from '../types/content';

const lenses = ['Proportion', 'Composition', 'Lighting', 'Values', 'Colour', 'Perspective', 'Texture', 'Edges', 'Brushwork', 'Accuracy', 'Anatomy', 'Depth'];

export function getStudioCritique(study: ReferenceStudy) {
  const portrait = study.subject === 'Portrait' || study.subject === 'Eyes' || study.subject === 'Human Figure';
  return {
    lenses,
    worked: portrait ? 'Your facial proportions are strong, and the larger shapes create a clear, believable structure.' : `Your ${study.skills[0].toLowerCase()} choices give the study a readable starting point and a clear sense of intention.`,
    improve: portrait ? 'The shadow under the cheek and jaw is lighter than the reference. Let that value family sit together before adding smaller colour shifts.' : `Revisit ${study.skills[1]?.toLowerCase() ?? 'the value structure'} before the details. Group the largest light and shadow shapes first.`,
    next: [study.skills[0], study.skills[1] ?? 'Values', 'Edges'],
    exercise: `Make a 10-minute ${study.subject.toLowerCase()} thumbnail with only three values, then compare its largest shapes to the reference.`,
  };
}
