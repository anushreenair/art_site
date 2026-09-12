import type { SearchTab, SearchFilters } from './types';
export const subjects = ['Portrait', 'Landscape', 'Flowers', 'Animals', 'Architecture', 'Still Life', 'Human Figure', 'Hands', 'Eyes', 'Nature', 'Objects', 'Abstract'];
export const media = ['Oil Painting', 'Acrylic', 'Watercolour', 'Gouache', 'Colored Pencil', 'Pencil', 'Chalk', 'Charcoal', 'Pastel', 'Ink', 'Mixed Media'];
export const skills = ['Lighting', 'Skin Tones', 'Perspective', 'Colour Mixing', 'Texture', 'Composition', 'Values', 'Shadows', 'Proportions', 'Anatomy', 'Brush Control', 'Edges', 'Depth', 'Contrast'];
export const searchTabs: SearchTab[] = ['All', 'References', 'Practice', 'Learning', 'Masters', 'Challenges', 'Community', 'Opportunities'];
const aliases: Array<[RegExp, string]> = [
  [/\bwatercolors?\b/g, 'watercolour'], [/\bcoloured pencils?\b/g, 'colored pencil'], [/\bflowers?\b/g, 'flowers'], [/\blandscapes?\b/g, 'landscape'],
  [/\bportraits?\b/g, 'portrait'], [/\banimals?\b/g, 'animals'], [/\bhands?\b/g, 'hands'], [/\beyes?\b/g, 'eyes'], [/\bskin tones?\b/g, 'skin tones'],
  [/\blight and shadow\b/g, 'lighting'], [/\bdramatic light(?:ing)?\b/g, 'lighting'], [/\bcolor mixing\b/g, 'colour mixing'], [/\bbengaluru\b/g, 'bangalore'],
];
export function normalize(value: string) {
  let text = value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  for (const [pattern, replacement] of aliases) text = text.replace(pattern, replacement);
  return text;
}
function has(text: string, phrase: string) { return ` ${text} `.includes(` ${normalize(phrase)} `); }
export function toMinutes(value: string) {
  const match = value.toLowerCase().match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?)\b/);
  return match ? Number(match[1]) * (/^h/.test(match[2]) ? 60 : 1) : undefined;
}
export function parseSearchQuery(query: string): SearchFilters {
  const text = normalize(query);
  const filters: SearchFilters = {};
  const subject = subjects.find(item => has(text, item));
  const medium = media.find(item => has(text, item)) ?? (has(text, 'oil') ? 'Oil Painting' : undefined);
  const skill = skills.find(item => has(text, item));
  const location = ['Bangalore', 'Mumbai', 'Delhi', 'Gurgaon', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Jaipur', 'Goa'].find(item => has(text, item));
  if (subject) filters.subject = subject;
  if (medium) filters.medium = medium;
  if (skill) filters.skill = skill;
  if (location) filters.location = location;
  if (/\b(easy|beginner|new to|starting)\b/.test(text)) filters.difficulty = 'Beginner';
  else if (/\b(advanced|expert)\b/.test(text)) filters.difficulty = 'Advanced';
  else if (/\b(intermediate|developing)\b/.test(text)) filters.difficulty = 'Intermediate';
  const duration = toMinutes(query);
  if (duration && duration <= 1440) filters.durationMinutes = duration;
  const types: Array<[RegExp, SearchTab]> = [
    [/\b(opportunities|opportunity|competitions?|exhibitions?|open calls?|residenc(?:y|ies)|grants?|workshops?|art fairs?|fellowships?)\b/, 'Opportunities'],
    [/\b(references?)\b/, 'References'], [/\b(challenges?)\b/, 'Challenges'], [/\b(community|posts?)\b/, 'Community'],
    [/\b(masters?)\b/, 'Masters'], [/\b(practi[cs]e|sessions?)\b/, 'Practice'], [/\b(teach|learn|learning|lessons?|how to)\b/, 'Learning'],
  ];
  const type = types.find(([pattern]) => pattern.test(text))?.[1];
  if (type) filters.type = type;
  const opportunityTypes: Array<[RegExp, string]> = [[/\bcompetitions?\b/, 'Competitions'], [/\bexhibitions?\b/, 'Exhibitions'], [/\bopen calls?\b/, 'Open Calls'], [/\bworkshops?\b/, 'Workshops'], [/\bresidenc(?:y|ies)\b/, 'Residencies'], [/\bgrants?\b/, 'Grants']];
  const opportunityType = opportunityTypes.find(([pattern]) => pattern.test(text))?.[1];
  if (opportunityType) filters.opportunityType = opportunityType;
  if (type === 'Opportunities' && /\bfree\b/.test(text)) filters.free = true;
  filters.current = type === 'Opportunities' || /\b(latest|current|upcoming|this month|this week|today|tomorrow|happening|near me)\b/.test(text);
  if (/\bnear me\b/.test(text) && !location) filters.needsLocation = true;
  return filters;
}
/** Accept only bounded provider fields; explicit local constraints win. */
export function validateIntent(input: unknown, fallback: SearchFilters): SearchFilters {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return fallback;
  const data = input as Record<string, unknown>;
  const result: SearchFilters = {};
  for (const [key, options] of [['subject', subjects], ['medium', media], ['skill', skills], ['difficulty', ['Beginner', 'Intermediate', 'Advanced']], ['type', searchTabs]] as const) {
    if (typeof data[key] === 'string' && (options as readonly string[]).includes(data[key] as string)) Object.assign(result, { [key]: data[key] });
  }
  if (typeof data.location === 'string' && data.location.length <= 80) result.location = data.location;
  if (typeof data.durationMinutes === 'number' && Number.isFinite(data.durationMinutes) && data.durationMinutes > 0 && data.durationMinutes <= 1440) result.durationMinutes = data.durationMinutes;
  return { ...result, ...fallback };
}
