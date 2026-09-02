import type { Difficulty, Medium, ReferenceStudy, Skill, StudyTime, Subject } from '../types/content';

export type StudyFilters = { difficulty: Difficulty[]; subject: Subject[]; medium: Medium[]; skill: Skill[]; time: StudyTime[] };

export const emptyStudyFilters: StudyFilters = { difficulty: [], subject: [], medium: [], skill: [], time: [] };

const matches = <T,>(selected: T[], value: T | T[]) => selected.length === 0 || (Array.isArray(value) ? value.some((item) => selected.includes(item)) : selected.includes(value));

export function filterStudies(studies: ReferenceStudy[], filters: StudyFilters, search: string) {
  const query = search.trim().toLowerCase();
  return studies.filter((study) => {
    const searchable = [study.title, study.subject, study.medium, ...study.skills].join(' ').toLowerCase();
    return matches(filters.difficulty, study.difficulty) && matches(filters.subject, study.subject) && matches(filters.medium, study.medium) && matches(filters.skill, study.skills) && matches(filters.time, study.time) && (!query || searchable.includes(query));
  });
}
