import { describe, expect, it } from 'vitest';
import { parseSearchQuery, searchInternal } from './search';

describe('parseSearchQuery', () => {
  it('extracts art filters from a conversational query', () => {
    expect(parseSearchQuery('I want to paint an easy flower in watercolor for 30 minutes')).toMatchObject({
      subject: 'Flowers',
      medium: 'Watercolour',
      difficulty: 'Beginner',
      durationMinutes: 30,
    });
  });

  it('recognizes current opportunity searches and locations', () => {
    expect(parseSearchQuery('Free art competitions in Mumbai this month')).toMatchObject({
      location: 'Mumbai',
      type: 'Opportunities',
      current: true,
    });
  });
});

describe('searchInternal', () => {
  it('ranks a matching reference ahead of unrelated content', () => {
    const results = searchInternal('beginner watercolor flowers 20 minutes', 'References');
    expect(results[0].title).toBe('Tulips in a glass');
    expect(results[0].actionLabel).toBe('View Reference');
  });
});
it('does not label mismatched media or unknown phrases as exact matches', () => {
  expect(searchInternal('advanced charcoal animal reference')).toEqual([]);
  expect(searchInternal('moon made of glass')).toEqual([]);
  expect(searchInternal('watercolor flowers', 'References').every(item => item.metadata.includes('Watercolour'))).toBe(true);
});
it('returns a hand practice within the requested time budget', () => {
  const found = searchInternal('I want to practice drawing hands for 20 minutes');
  expect(found.some(item => item.actionTo === '/practice/ref-hands')).toBe(true);
  expect(found.every(item => item.type === 'Practice')).toBe(true);
});
it('opens real lesson and master destinations', () => {
  expect(searchInternal('skin tones', 'Learning')[0].actionTo).toContain('/learning?path=portrait');
  expect(searchInternal('Hokusai', 'Masters')[0].actionTo).toContain('study=hokusai-wave');
});
it('extracts singular aliases without substring collisions', () => {
  expect(parseSearchQuery('draw a hand in colored pencil for 1 hour')).toMatchObject({ subject: 'Hands', medium: 'Colored Pencil', durationMinutes: 60 });
  expect(parseSearchQuery('thinking about painting')).not.toHaveProperty('medium');
  expect(parseSearchQuery('Free art competitions in Mumbai this month')).toHaveProperty('free', true);
  expect(parseSearchQuery('art exhibitions near Delhi')).toMatchObject({type: 'Opportunities', current: true, location: 'Delhi'});
});
