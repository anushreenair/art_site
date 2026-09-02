import { describe, expect, it } from 'vitest';
import { referenceStudies } from '../data/atelier-data';
import { emptyStudyFilters, filterStudies } from './filterStudies';

describe('filterStudies', () => {
  it('uses OR within a filter group and AND across groups', () => {
    const matches = filterStudies(referenceStudies, { ...emptyStudyFilters, subject: ['Portrait', 'Hands'], medium: ['Pencil'] }, '');
    expect(matches.map((study) => study.subject)).toEqual(['Portrait', 'Hands']);
  });

  it('finds a study by one of its skill labels', () => {
    expect(filterStudies(referenceStudies, emptyStudyFilters, 'perspective').every((study) => study.skills.includes('Perspective'))).toBe(true);
  });
});
