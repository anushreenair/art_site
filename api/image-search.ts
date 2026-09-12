export type ImageSearchResult = {
  thumbnail: string;
  imageUrl: string;
  title: string;
  source: string;
  sourceUrl: string;
  width?: number;
  height?: number;
  creator?: string;
  license?: string;
};

type OpenverseImage = {
  thumbnail?: string;
  url?: string;
  title?: string;
  creator?: string;
  foreign_landing_url?: string;
  width?: number;
  height?: number;
  license?: string;
  license_version?: string;
};

export async function GET(req: Request): Promise<Response> {
  const query = new URL(req.url).searchParams.get('q')?.trim() ?? '';
  if (!query || query.length > 300) return json({ ok: false, error: 'Add an image search between 1 and 300 characters.' }, 400);
  try {
    const pages = await Promise.all([1, 2].map(async (page) => {
      const url = new URL('https://api.openverse.org/v1/images/');
      url.searchParams.set('q', query);
      url.searchParams.set('page', String(page));
      url.searchParams.set('page_size', '100');
      const response = await fetch(url.toString(), { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Openverse unavailable');
      return await response.json() as { results?: OpenverseImage[] };
    }));
    const results = pages.flatMap((payload) => {
      return (payload.results ?? []).flatMap((item): ImageSearchResult[] => {
        const thumbnail = item.thumbnail;
        const imageUrl = item.url ?? thumbnail;
        const sourceUrl = item.foreign_landing_url;
        if (!thumbnail || !imageUrl || !sourceUrl) return [];
        const license = item.license ? `${item.license.toUpperCase()}${item.license_version ? ` ${item.license_version}` : ''}` : 'License not provided';
        return [{ thumbnail, imageUrl, title: item.title ?? 'Untitled reference', source: `Openverse${item.creator ? ` · ${item.creator}` : ''}`, sourceUrl, width: item.width, height: item.height, creator: item.creator, license }];
      });
    });
    const uniqueResults = [...new Map(results.map((result) => [`${result.imageUrl}|${result.sourceUrl}`, result])).values()];
    return json({ ok: true, results: uniqueResults });
  } catch {
    return json({ ok: false, error: 'Image search is unavailable right now.' }, 502);
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}