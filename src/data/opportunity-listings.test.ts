import { describe, expect, it } from 'vitest';
import { filterOpportunities, opportunityListings } from './opportunity-listings';

describe('filterOpportunities', () => {
  it('applies the extended opportunity filters to the selected tab', () => {
    const result = filterOpportunities(opportunityListings, 'Competitions', {
      city: '', format: '', medium: '', experience: '', cost: '', date: '', deadline: '', category: 'Landscape & still life', eligibility: 'Indian residents', age: '18+', prize: 'Has prize', entryFee: 'Entry fee',
    });

    expect(result.map((listing) => listing.id)).toEqual(['mumbai-watercolour']);
  });
});
