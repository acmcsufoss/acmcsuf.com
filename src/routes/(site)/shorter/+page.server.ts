import type { PageServerLoad } from './$types';

const SHORTLINKS_ORIGIN = 'https://s.acmcsuf.com';

interface Shortlink {
  slug: string;
  url: string;
}

interface ShortlinksResponse {
  success: boolean;
  result: Shortlink[];
}

export const load: PageServerLoad = async ({ fetch }) => {
  const links: Shortlink[] = [];
  let page = 1;

  try {
    while (true) {
      const response = await fetch(`${SHORTLINKS_ORIGIN}/?page=${page}&per_page=100`);
      if (!response.ok) break;

      const payload = (await response.json()) as ShortlinksResponse;
      if (!payload.success || payload.result.length === 0) break;

      links.push(...payload.result);
      if (payload.result.length < 100) break;
      page += 1;
    }
  } catch {
    // Render the page even when the shortlink service is temporarily unavailable.
  }

  return { links };
};
