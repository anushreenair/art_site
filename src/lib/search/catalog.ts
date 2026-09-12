import { referenceStudies, currentLesson, recommendedPractice, challenge } from '../../data/atelier-data';
import { getDailyChallenge } from '../../data/challenges';
import { learningPaths } from '../../data/learning-paths';
import { masterStudies } from '../../data/master-studies';
import { opportunityListings } from '../../data/opportunity-listings';
import { communityPosts } from '../../data/community-posts';
import { normalize, parseSearchQuery, toMinutes } from './intent';
import type { SearchDocument } from './types';
function document(item: Omit<SearchDocument, 'searchText'>): SearchDocument {
  return { ...item, searchText: normalize([item.title, item.description, ...item.metadata].join(' ')) };
}
function studyFields(id: string) {
  const study = referenceStudies.find(item => item.id === id)!;
  return { subject: study.subject, medium: study.medium, difficulty: study.difficulty, durationMinutes: toMinutes(study.time) };
}
export function getSearchDocuments(): SearchDocument[] {
  const references = referenceStudies.map(study => document({
    id: study.id, type: 'References', title: study.title, description: `${study.subject} reference for ${study.difficulty} artists.`,
    metadata: [study.subject, study.medium, study.difficulty, study.time, ...study.skills], filters: studyFields(study.id), imageUrl: study.imageUrl,
    actionLabel: 'View Reference', actionTo: `/practice/${study.id}`,
  }));
  const practiceReferences = references.map(item => document({ ...item, id: `practice-${item.id}`, type: 'Practice', title: `Practise ${item.title.toLowerCase()}`, actionLabel: 'Start Practice' }));
  const featured = [currentLesson, recommendedPractice, challenge].map((item, i) => document({
    id: item.id, type: 'Practice', title: item.title, description: item.description, metadata: [item.duration, item.level], imageUrl: item.imageUrl,
    filters: { ...studyFields(['ref-portrait', 'ref-still-life', 'ref-figure'][i]), durationMinutes: toMinutes(item.duration) },
    actionLabel: 'Start Practice', actionTo: `/practice/${['ref-portrait', 'ref-still-life', 'ref-figure'][i]}`,
  }));
  const lessons = learningPaths.flatMap(path => path.lessons.map((lesson, i) => document({
    id: `lesson-${path.id}-${i}`, type: 'Learning', title: lesson.title, description: `${path.title}. ${lesson.focus}`,
    metadata: [path.title, path.level, lesson.duration],
    // The path describes the taught medium; a practice image does not establish it.
    filters: { ...parseSearchQuery(path.title), difficulty: path.level, durationMinutes: toMinutes(lesson.duration) },
    actionLabel: 'Open Lesson', actionTo: `/learning?path=${path.id}#lesson-${i}`,
  })));
  const masters = masterStudies.flatMap(master => [document({
    id: master.id, type: 'Masters', title: master.title, description: `${master.artist}: ${master.movement}. ${master.analysis.map(item => `${item.label}: ${item.note}`).join(' ')}`,
    metadata: [master.medium, master.artist], filters: parseSearchQuery(master.medium), imageUrl: master.image, actionLabel: 'Study Master', actionTo: `/masters?study=${master.id}#selected-master`,
  }), ...master.activities.map((activity, i) => document({
    id: `${master.id}-practice-${i}`, type: 'Practice', title: activity.title, description: activity.note, metadata: [master.title, activity.duration],
    filters: { ...studyFields(activity.studyId), durationMinutes: toMinutes(activity.duration) }, actionLabel: 'Start Practice', actionTo: `/practice/${activity.studyId}`,
  }))]);
  const opportunities = opportunityListings.map(item => document({
    id: item.id, type: 'Opportunities', title: item.name, description: `${item.venue} · ${item.eligibility}. Listed in Atelier; confirm dates with the organiser.`,
    metadata: [item.city, item.type, item.medium, item.date, item.deadline, item.entryFee],
    filters: { location: item.city, medium: item.medium, free: item.entryFee === 'Free', opportunityType: item.type },
    actionLabel: 'View Opportunity', actionTo: `/opportunities?opportunity=${item.id}#opportunity-${item.id}`,
  }));
  const posts = communityPosts.map(item => document({
    id: `post-${item.id}`, type: 'Community', title: item.title, description: `${item.artist}: ${item.note}`, metadata: [item.context, item.artist], filters: parseSearchQuery(item.context), imageUrl: item.image,
    actionLabel: 'Open Community', actionTo: `/community#post-${item.id}`,
  }));
  const daily = getDailyChallenge();
  const dailyDocument = document({ id: daily.id, type: 'Challenges', title: daily.title, description: daily.reference.title, metadata: [daily.theme, daily.mainSkill, '45 minutes'],
    filters: { ...studyFields(daily.reference.id), durationMinutes: 45 }, imageUrl: daily.reference.imageUrl, actionLabel: 'Join Challenge', actionTo: '/challenge' });
  return [...references, ...practiceReferences, ...featured, ...lessons, ...masters, ...opportunities, ...posts, dailyDocument];
}
