import { getExternalReferences } from '../externalReferences';
import { normalize } from './intent';
import type { SearchDocument } from './types';
export function getSavedSearchDocuments(): SearchDocument[] {
  try {
    return getExternalReferences().map(item => ({ id: `saved-${item.id}`, private: true, type: 'References', title: item.title, description: item.description,
      searchText: normalize(`${item.title} ${item.description} ${item.creator_name}`),
      metadata: [item.creator_name, item.source_platform, 'Saved on this device'].filter(Boolean), actionLabel: 'View Reference', actionTo: `/references/saved#saved-${item.id}` }));
  } catch { return []; }
}
