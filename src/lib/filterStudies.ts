import type { Difficulty, Medium, ReferenceStudy, Skill, StudyTime, Subject } from '../types/content';

export type RightsFilter = 'Can Sell Resulting Artwork' | 'Can Publish Online' | 'Practice Only' | 'Public Domain';
export type StudyFilters = { difficulty: Difficulty[]; subject: Subject[]; medium: Medium[]; skill: Skill[]; time: StudyTime[]; rights: RightsFilter[] };

export const emptyStudyFilters: StudyFilters = { difficulty: [], subject: [], medium: [], skill: [], time: [], rights: [] };

const matches = <T,>(selected: T[], value: T | T[]) => selected.length === 0 || (Array.isArray(value) ? value.some((item) => selected.includes(item)) : selected.includes(value));

export function filterStudies(studies: ReferenceStudy[], filters: StudyFilters, search: string) {
  const query = search.trim().toLowerCase();
  return studies.filter((study) => {
    const searchable = [study.title, study.subject, study.medium, ...study.skills].join(' ').toLowerCase();
    const rightsMatch = filters.rights.length === 0 || filters.rights.some((right) => (
      (right === 'Can Sell Resulting Artwork' && study.licensing.canSellResultingArtwork)
      || (right === 'Can Publish Online' && study.licensing.canPublishOnline)
      || (right === 'Practice Only' && study.licensing.practiceOnly)
      || (right === 'Public Domain' && study.licensing.publicDomain)
    ));
    return matches(filters.difficulty, study.difficulty) && matches(filters.subject, study.subject) && matches(filters.medium, study.medium) && matches(filters.skill, study.skills) && matches(filters.time, study.time) && rightsMatch && (!query || searchable.includes(query));
  });
}
