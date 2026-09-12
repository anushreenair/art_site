export type SearchTab = 'All' | 'References' | 'Practice' | 'Learning' | 'Masters' | 'Challenges' | 'Community' | 'Opportunities';
export type SearchFilters = {
  subject?: string;
  medium?: string;
  difficulty?: string;
  skill?: string;
  durationMinutes?: number;
  location?: string;
  type?: SearchTab;
  current?: boolean;
  free?: boolean;
  opportunityType?: string;
  needsLocation?: boolean;
};

export type SearchDocument = {
  id: string;
  type: Exclude<SearchTab, 'All'>;
  title: string;
  description: string;
  metadata: string[];
  searchText: string;
  filters?: SearchFilters;
  private?: boolean;
  imageUrl?: string;
  actionLabel: string;
  actionTo: string;
};

export type SearchResult = SearchDocument & { score: number; matchedFilters: string[] };

