import { describe, expect, it } from 'vitest';
import { referenceStudies } from './atelier-data';

describe('reference studies', () => {
  it('covers every practice subject with actionable card data', () => {
    const subjects = new Set(referenceStudies.map((study) => study.subject));
    expect(subjects).toEqual(new Set(['Portrait', 'Landscape', 'Flowers', 'Animals', 'Architecture', 'Still Life', 'Human Figure', 'Hands', 'Eyes', 'Nature', 'Objects', 'Abstract']));
    expect(referenceStudies.every((study) => study.medium && study.time && study.skills.length && study.attempts > 0 && study.rights)).toBe(true);
  });
});
