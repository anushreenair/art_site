/** Step A never requests an external page. A future backend must independently
 * validate resolved IPs and every redirect; client checks are not SSRF protection. */
export const sourcePlatforms = ['Pinterest', 'Instagram', 'Behance', 'ArtStation', 'DeviantArt', 'Wikimedia', 'Museum', 'Photography Site', 'Blog', 'Website', 'Unknown Source'] as const;
export type SourcePlatform = typeof sourcePlatforms[number];
export type ReferenceDraft = {
  title: string;
  description: string;
  source_url: string;
  canonical_url: string;
  source_platform: SourcePlatform;
  creator_name: string;
  creator_url: string;
  thumbnail_url: string;
  thumbnail_permission_status: 'Unavailable';
  copyright_status: 'Rights Unknown';
  visibility: 'Private';
  metadata_json: { mode: 'placeholder' };
};
export type ExternalReference = ReferenceDraft & { id: string; created_at: string; updated_at: string };
const storageKey = 'atelier-external-references-v1';
const invalidUrl = 'Please enter a valid public URL.';

export function validateSourceUrl(input: string): string {
  const value = input.trim();
  if (!value || value.length > 4096 || /[\s\u0000-\u001f\u007f<>\\]/.test(value) || /%(?:00|0a|0d|3c|3e)/i.test(value)) throw new Error(invalidUrl);
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(invalidUrl); }
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  // Reject all IP literals, including normalized numeric/hex IPv4, and local names.
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port ||
    !host.includes('.') || /^[\d.]+$/.test(host) || host.includes(':') || host.includes('[') ||
    /(?:^|\.)(?:localhost|local|internal|intranet|lan|home|test|invalid|onion)$/.test(host) ||
    !host.split('.').every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) throw new Error(invalidUrl);
  url.protocol = 'https:';
  url.hostname = host;
  return url.href;
}

const platformDomains: [SourcePlatform, string[]][] = [
  ['Pinterest', ['pinterest.com', 'pinterest.co.uk', 'pinterest.ca', 'pinterest.fr', 'pinterest.de', 'pinterest.jp', 'pinterest.com.au', 'pin.it']],
  ['Instagram', ['instagram.com']], ['Behance', ['behance.net']],
  ['ArtStation', ['artstation.com']], ['DeviantArt', ['deviantart.com']],
  ['Wikimedia', ['wikimedia.org', 'wikipedia.org']],
  ['Museum', ['metmuseum.org', 'rijksmuseum.nl', 'louvre.fr', 'tate.org.uk', 'artic.edu', 'nga.gov', 'moma.org', 'britishmuseum.org']],
  ['Photography Site', ['unsplash.com', 'pexels.com', 'flickr.com', '500px.com']],
  ['Blog', ['wordpress.com', 'blogspot.com', 'medium.com', 'substack.com']],
];

export function detectSourcePlatform(input: string): SourcePlatform {
  let host: string;
  try { host = new URL(input).hostname.toLowerCase().replace(/\.$/, ''); } catch { return 'Unknown Source'; }
  return platformDomains.find(([, domains]) => domains.some((domain) => host === domain || host.endsWith(`.${domain}`)))?.[0] ?? 'Website';
}

function textOnly(value: string, length: number): string {
  return value.replace(/<[^>]*>/g, '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, length);
}

/** Replace this adapter with an approved metadata service when one exists.
 * The placeholder is derived only from the URL, never attributed to its author. */
export async function fetchReferenceMetadata(input: string): Promise<ReferenceDraft> {
  const source_url = validateSourceUrl(input);
  const source_platform = detectSourcePlatform(source_url);
  return {
    source_url, canonical_url: source_url, source_platform,
    title: `Reference from ${source_platform === 'Website' ? new URL(source_url).hostname : source_platform}`,
    description: '', creator_name: '', creator_url: '', thumbnail_url: '',
    thumbnail_permission_status: 'Unavailable', copyright_status: 'Rights Unknown',
    visibility: 'Private', metadata_json: { mode: 'placeholder' },
  };
}

function cleanDraft(draft: ReferenceDraft): ReferenceDraft {
  const source_url = validateSourceUrl(draft.source_url);
  const source_platform = sourcePlatforms.includes(draft.source_platform) ? draft.source_platform : detectSourcePlatform(source_url);
  return {
    source_url, canonical_url: source_url, source_platform,
    title: textOnly(draft.title, 200) || `Reference from ${new URL(source_url).hostname}`,
    creator_name: textOnly(draft.creator_name, 160), description: textOnly(draft.description, 4000),
    creator_url: '', thumbnail_url: '', thumbnail_permission_status: 'Unavailable',
    copyright_status: 'Rights Unknown', visibility: 'Private', metadata_json: { mode: 'placeholder' },
  };
}

export function getExternalReferences(): ExternalReference[] {
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return [];
  const stored: unknown = JSON.parse(raw);
  if (!stored || typeof stored !== 'object' || !('version' in stored) || stored.version !== 1 || !('references' in stored) || !Array.isArray(stored.references)) throw new Error('Saved references could not be read.');
  // Validate storage before it reaches the UI; never overwrite malformed data.
  return stored.references.map((item: unknown) => {
    if (!item || typeof item !== 'object') throw new Error('Invalid saved reference.');
    const entry = item as Record<string, unknown>;
    for (const key of ['id', 'source_url', 'title', 'creator_name', 'description', 'source_platform', 'created_at', 'updated_at']) {
      if (typeof entry[key] !== 'string') throw new Error('Invalid saved reference.');
    }
    const reference = entry as unknown as ExternalReference;
    return { ...cleanDraft(reference), id: reference.id, created_at: reference.created_at, updated_at: reference.updated_at };
  });
}

export function saveExternalReference(draft: ReferenceDraft): ExternalReference {
  const references = getExternalReferences();
  const timestamp = new Date().toISOString();
  const reference = { ...cleanDraft(draft), id: crypto.randomUUID(), created_at: timestamp, updated_at: timestamp };
  window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, references: [reference, ...references] }));
  return reference;
}
