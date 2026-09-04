import { referenceStudies } from '../data/atelier-data';
import type { Difficulty, Medium, Skill, StudyTime, Subject } from '../types/content';

export type PracticeLength = StudyTime | 'No Time Limit';
export type PracticeChoices = { subject: Subject; difficulty: Difficulty; medium: Medium; skills: Skill[]; time: PracticeLength };

export type PracticeSession = { title: string; study: typeof referenceStudies[number]; goal: string; skills: Skill[]; seconds: number; guidance: string };

const secondsByTime: Record<PracticeLength, number> = { '5 minutes': 300, '10 minutes': 600, '20 minutes': 1200, '30 minutes': 1800, '45 minutes': 2700, '1 hour': 3600, '2 hours': 7200, 'Long Study': 10800, 'No Time Limit': 0 };

const sessionName = (time: PracticeLength) => time === 'No Time Limit' ? 'Open-ended' : time.replace(' minutes', '-Minute').replace(' hour', '-Hour').replace(' hours', '-Hours').replace('Long Study', 'Long Study');

export function buildPracticeSession(choices: PracticeChoices): PracticeSession {
  const study = [...referenceStudies].sort((first, second) => score(second, choices) - score(first, choices))[0];
  const focus = choices.skills.length > 1 ? `${choices.skills[0]} + ${choices.skills[1]}` : choices.skills[0];
  return {
    title: `${sessionName(choices.time)} ${choices.difficulty} ${choices.medium} ${choices.subject}`,
    study,
    goal: `Make one clear ${choices.subject.toLowerCase()} study with deliberate ${focus.toLowerCase()}.`,
    skills: choices.skills,
    seconds: secondsByTime[choices.time],
    guidance: `Begin with two minutes of observation. Look for ${focus.toLowerCase()}, then commit to the largest shapes before details.`,
  };
}

function score(study: typeof referenceStudies[number], choices: PracticeChoices) {
  return (study.subject === choices.subject ? 8 : 0) + (study.difficulty === choices.difficulty ? 4 : 0) + (study.medium === choices.medium ? 3 : 0) + choices.skills.filter((skill) => study.skills.includes(skill)).length * 2 + (study.time === choices.time ? 3 : 0);
}
