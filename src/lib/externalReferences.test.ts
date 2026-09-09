import { beforeEach, describe, expect, it } from 'vitest';
import { detectSourcePlatform, fetchReferenceMetadata, getExternalReferences, saveExternalReference, validateSourceUrl } from './externalReferences';

describe('external reference sources', () => {
  it.each([
    'javascript:alert(1)', 'data:text/html,hello', 'file:///etc/passwd',
    'http://localhost/a', 'https://localhost./', 'https://studio.local/',
    'https://intranet/', 'http://127.0.0.1/', 'http://2130706433/',
    'http://0x7f000001/', 'http://10.1.1.1/', 'http://172.16.0.1/',
    'http://192.168.1.1/', 'http://169.254.169.254/', 'http://[::1]/',
    'http://[::ffff:127.0.0.1]/', 'https://[fc00::1]/',
    'https://user:password@example.com/', 'https://example.com:8080/',
    'https://example.com/<script>', 'not a url', 'https://exa mple.com/',
  ])('rejects unsafe or non-public source %s', (url) => {
    expect(() => validateSourceUrl(url)).toThrow('Please enter a valid public URL.');
  });
  it('prefers HTTPS and preserves the path, query and fragment', () => {
    expect(validateSourceUrl(' http://example.com/art?work=10#detail ')).toBe('https://example.com/art?work=10#detail');
  });
  it.each([
    ['https://www.pinterest.com/pin/1', 'Pinterest'], ['https://pin.it/abcd', 'Pinterest'],
    ['https://instagram.com/p/1', 'Instagram'], ['https://www.behance.net/gallery/1', 'Behance'],
    ['https://artist.artstation.com/projects/1', 'ArtStation'], ['https://deviantart.com/a', 'DeviantArt'],
    ['https://commons.wikimedia.org/wiki/Art', 'Wikimedia'], ['https://www.metmuseum.org/art/collection', 'Museum'],
    ['https://www.flickr.com/photos/1', 'Photography Site'], ['https://artist.wordpress.com/post', 'Blog'],
    ['https://instagram.com.evil.com/art', 'Website'], ['https://notpinterest.com/art', 'Website'],
  ])('detects %s without substring spoofing', (url, platform) => {
    expect(detectSourcePlatform(url)).toBe(platform);
  });
  it('produces honest link-only metadata without invented credit or rights', async () => {
    const metadata = await fetchReferenceMetadata('https://www.pinterest.com/pin/1');
    expect(metadata.source_platform).toBe('Pinterest');
    expect(metadata.title).toBe('Reference from Pinterest');
    expect(metadata.creator_name).toBe('');
    expect(metadata.thumbnail_url).toBe('');
    expect(metadata.metadata_json.mode).toBe('placeholder');
    expect(metadata.copyright_status).toBe('Rights Unknown');
    expect(metadata.visibility).toBe('Private');
  });
});

describe('external reference storage', () => {
  const storage = new Map<string, string>();
  beforeEach(() => {
    storage.clear();
    Object.defineProperty(window, 'localStorage', { configurable: true, value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    } });
  });
  it('stores plain text and preserves the source and private defaults', async () => {
    const draft = await fetchReferenceMetadata('https://example.com/art');
    saveExternalReference({ ...draft, title: '<b>Portrait</b>', creator_name: '<img src=x onerror=alert(1)>Jane' });
    expect(getExternalReferences()[0]).toMatchObject({ title: 'Portrait', creator_name: 'Jane', source_url: draft.source_url, visibility: 'Private', copyright_status: 'Rights Unknown' });
  });
  it('never overwrites malformed existing data', async () => {
    storage.set('atelier-external-references-v1', 'broken data');
    const draft = await fetchReferenceMetadata('https://example.com/art');
    expect(() => saveExternalReference(draft)).toThrow();
    expect(storage.get('atelier-external-references-v1')).toBe('broken data');
  });
  it('rejects an unsafe source tampered into saved data', async () => {
    const draft = await fetchReferenceMetadata('https://example.com/art');
    const saved = saveExternalReference(draft);
    storage.set('atelier-external-references-v1', JSON.stringify({ version: 1, references: [{ ...saved, source_url: 'javascript:alert(1)' }] }));
    expect(() => getExternalReferences()).toThrow();
  });
});
