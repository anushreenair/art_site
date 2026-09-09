export type JournalEntry = {
  id: string;
  sessionTitle: string;
  createdAt: string;
  worked: string;
  difficult: string;
  learned: string;
  improve: string;
};

export type JournalRecommendation = { focus: string; count: number; title: string; href: string };

const storageKey = 'atelier-practice-journal';
const topics = [
  { focus: 'Skin Tones', terms: ['skin tone'], title: '20-Minute Skin Tone Study' },
  { focus: 'Perspective', terms: ['perspective'], title: '20-Minute Perspective Exercise' },
  { focus: 'Values', terms: ['value', 'values'], title: '20-Minute Value Study' },
  { focus: 'Lighting', terms: ['lighting', 'light direction'], title: '20-Minute Lighting Study' },
  { focus: 'Colour Mixing', terms: ['colour mixing', 'color mixing'], title: '20-Minute Colour Mixing Study' },
];

export function getJournalEntries(): JournalEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(storageKey);
    const entries = stored ? JSON.parse(stored) : [];
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

export function saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt'>) {
  const next = { ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  const entries = [next, ...getJournalEntries()].slice(0, 30);
  window.localStorage.setItem(storageKey, JSON.stringify(entries));
  return next;
}

export function getJournalRecommendation(entries: JournalEntry[]): JournalRecommendation | null {
  const ranked = topics.map((topic) => ({ ...topic, count: entries.filter((entry) => {
    const text = `${entry.difficult} ${entry.improve}`.toLowerCase();
    return topic.terms.some((term) => text.includes(term));
  }).length })).sort((a, b) => b.count - a.count);
  const top = ranked[0];
  return top && top.count >= 2 ? { focus: top.focus, count: top.count, title: top.title, href: '/build-practice' } : null;
}
