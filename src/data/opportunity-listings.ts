export const opportunityTabs = ['Nearby', 'Competitions', 'Workshops', 'Exhibitions', 'Open Calls', 'Residencies', 'Grants', 'Fellowships', 'Art Fairs', 'Meetups', 'Gallery Opportunities', 'Commissions', 'Online Opportunities'] as const;

export type OpportunityTab = (typeof opportunityTabs)[number];

export type ArtistOpportunity = {
  id: string;
  name: string;
  type: Exclude<OpportunityTab, 'Nearby' | 'Online Opportunities'>;
  city: string;
  venue: string;
  date: string;
  deadline: string;
  entryFee: string;
  prize: string;
  category: string;
  medium: string;
  eligibility: string;
  experience: 'Beginner' | 'Intermediate' | 'Advanced' | 'Emerging' | 'Any level' | 'Established';
  age: string;
  format: 'Online' | 'Offline';
  officialSource: string;
  action: 'Apply' | 'Register';
  closingSoon?: boolean;
  recommended?: boolean;
};

export const opportunityCities = ['Bangalore', 'Mumbai', 'Delhi', 'Gurgaon', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Jaipur', 'Goa'] as const;

export const opportunityListings: ArtistOpportunity[] = [
  { id: 'sketch-bangalore', name: 'Bangalore Urban Sketchers: Cubbon Park', type: 'Meetups', city: 'Bangalore', venue: 'Bal Bhavan Gate', date: '14 Sep 2026 · 8:00 AM', deadline: '13 Sep 2026', entryFee: 'Free', prize: '—', category: 'Urban sketching', medium: 'Ink', eligibility: 'Open to all artists', experience: 'Any level', age: '16+', format: 'Offline', officialSource: 'Urban Sketchers Bengaluru', action: 'Register', recommended: true },
  { id: 'monsoon-prize', name: 'Monsoon Prize for Contemporary Art', type: 'Competitions', city: 'Delhi', venue: 'Bikaner House', date: '12–28 Nov 2026', deadline: '18 Sep 2026', entryFee: '₹1,200', prize: '₹2,00,000', category: 'Contemporary art', medium: 'Mixed Media', eligibility: 'Artists based in India', experience: 'Any level', age: '18+', format: 'Offline', officialSource: 'Monsoon Arts Foundation', action: 'Apply', closingSoon: true },
  { id: 'mumbai-watercolour', name: 'Mumbai Watercolour Open', type: 'Competitions', city: 'Mumbai', venue: 'Jehangir Art Gallery', date: '4–10 Dec 2026', deadline: '25 Sep 2026', entryFee: '₹750', prize: '₹75,000', category: 'Landscape & still life', medium: 'Watercolour', eligibility: 'Indian residents', experience: 'Any level', age: '18+', format: 'Offline', officialSource: 'Bombay Watercolour Society', action: 'Apply', recommended: true },
  { id: 'light-workshop', name: 'Painting Light in Three Decisions', type: 'Workshops', city: 'Pune', venue: 'The Art Loft, Koregaon Park', date: '20 Sep 2026 · 10:00 AM', deadline: '19 Sep 2026', entryFee: '₹1,850', prize: '—', category: 'Portrait', medium: 'Oil Painting', eligibility: 'Bring basic materials', experience: 'Intermediate', age: '16+', format: 'Offline', officialSource: 'The Art Loft', action: 'Register', closingSoon: true },
  { id: 'goa-figures', name: 'New Figurative Voices', type: 'Exhibitions', city: 'Goa', venue: 'Sunaparanta Goa Centre', date: '8 Jan–2 Feb 2027', deadline: '3 Oct 2026', entryFee: 'Free', prize: 'Curatorial mentorship', category: 'Human Figure', medium: 'Mixed Media', eligibility: 'Emerging artists in South Asia', experience: 'Emerging', age: '21+', format: 'Offline', officialSource: 'Sunaparanta Goa Centre', action: 'Apply' },
  { id: 'climate-open-call', name: 'The Climate Sketchbook', type: 'Open Calls', city: 'Online', venue: 'Digital publication', date: 'Published Jan 2027', deadline: '22 Sep 2026', entryFee: 'Free', prize: 'Selected work feature', category: 'Nature', medium: 'Any medium', eligibility: 'International submissions', experience: 'Any level', age: '16+', format: 'Online', officialSource: 'Field Notes Journal', action: 'Apply', closingSoon: true, recommended: true },
  { id: 'jaipur-residency', name: 'Saffron Studio Residency', type: 'Residencies', city: 'Jaipur', venue: 'Amer Studio House', date: '6–27 Feb 2027', deadline: '30 Sep 2026', entryFee: '₹500', prize: 'Studio + ₹35,000 stipend', category: 'Material research', medium: 'Mixed Media', eligibility: 'Artists with 2+ years practice', experience: 'Established', age: '21+', format: 'Offline', officialSource: 'Saffron Studio House', action: 'Apply' },
  { id: 'material-grant', name: 'Material Futures Microgrant', type: 'Grants', city: 'Online', venue: 'Remote', date: 'Awarded Nov 2026', deadline: '15 Oct 2026', entryFee: 'Free', prize: '₹50,000 grant', category: 'Experimental practice', medium: 'Any medium', eligibility: 'India-based independent artists', experience: 'Any level', age: '18+', format: 'Online', officialSource: 'Material Futures Fund', action: 'Apply', recommended: true },
  { id: 'chennai-fellowship', name: 'Coastal Studio Fellowship', type: 'Fellowships', city: 'Chennai', venue: 'Cholamandal Artists’ Village', date: 'Apr–Jun 2027', deadline: '8 Oct 2026', entryFee: 'Free', prize: '₹1,20,000 fellowship', category: 'Painting', medium: 'Acrylic', eligibility: 'Early-career Indian artists', experience: 'Emerging', age: '21–35', format: 'Offline', officialSource: 'Cholamandal Foundation', action: 'Apply' },
  { id: 'art-fair-delhi', name: 'Independent Editions at Delhi Art Week', type: 'Art Fairs', city: 'Delhi', venue: 'NSIC Exhibition Grounds', date: '5–8 Mar 2027', deadline: '12 Oct 2026', entryFee: '₹3,500', prize: 'Sales opportunity', category: 'Prints & editions', medium: 'Ink', eligibility: 'Independent artists and collectives', experience: 'Any level', age: '18+', format: 'Offline', officialSource: 'Delhi Art Week', action: 'Apply' },
  { id: 'gallery-mumbai', name: 'Gallery 47 Emerging Artist Review', type: 'Gallery Opportunities', city: 'Mumbai', venue: 'Kala Ghoda', date: 'Representation review · Nov 2026', deadline: '28 Sep 2026', entryFee: 'Free', prize: 'Solo project consideration', category: 'Contemporary art', medium: 'Oil Painting', eligibility: 'Artists with a cohesive body of work', experience: 'Emerging', age: '21+', format: 'Offline', officialSource: 'Gallery 47', action: 'Apply', closingSoon: true },
  { id: 'editorial-commission', name: 'Illustrated Stories: Editorial Commission', type: 'Commissions', city: 'Online', venue: 'Remote', date: 'Commission begins Nov 2026', deadline: '6 Oct 2026', entryFee: 'Free', prize: 'Paid commission · ₹30,000', category: 'Editorial illustration', medium: 'Gouache', eligibility: 'Portfolio required', experience: 'Any level', age: '18+', format: 'Online', officialSource: 'The Sunday Review', action: 'Apply' },
  { id: 'hyderabad-architecture', name: 'Architecture in Ink: Field Workshop', type: 'Workshops', city: 'Hyderabad', venue: 'Salar Jung Museum', date: '27 Sep 2026 · 9:30 AM', deadline: '26 Sep 2026', entryFee: '₹950', prize: '—', category: 'Architecture', medium: 'Ink', eligibility: 'Open to all artists', experience: 'Any level', age: '14+', format: 'Offline', officialSource: 'Deccan Drawing Club', action: 'Register' },
];

export function filterOpportunities(listings: ArtistOpportunity[], tab: OpportunityTab, filters: Record<string, string>) {
  return listings.filter((listing) => {
    const tabMatches = tab === 'Nearby' ? listing.city === 'Bangalore' : tab === 'Online Opportunities' ? listing.format === 'Online' : listing.type === tab;
    const dateMatches = !filters.date || listing.date.includes(filters.date);
    const deadlineMatches = !filters.deadline || (filters.deadline === 'Closing soon' ? Boolean(listing.closingSoon) : listing.deadline.includes('Sep'));
    const prizeMatches = !filters.prize || (filters.prize === 'Has prize' ? listing.prize !== '—' : listing.prize === '—');
    const entryFeeMatches = !filters.entryFee || (filters.entryFee === 'Free' ? listing.entryFee === 'Free' : listing.entryFee !== 'Free');
    return tabMatches
      && (!filters.city || listing.city === filters.city)
      && (!filters.format || listing.format === filters.format)
      && (!filters.medium || listing.medium === filters.medium)
      && (!filters.experience || listing.experience === filters.experience)
      && (!filters.cost || (filters.cost === 'Free' ? listing.entryFee === 'Free' : listing.entryFee !== 'Free'))
      && dateMatches
      && deadlineMatches
      && (!filters.category || listing.category === filters.category)
      && (!filters.eligibility || listing.eligibility === filters.eligibility)
      && (!filters.age || listing.age === filters.age)
      && prizeMatches
      && entryFeeMatches;
  });
}
