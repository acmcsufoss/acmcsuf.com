import type { PageLoad } from "./$types";
interface Link {
  slug: string;
  url: string;
  isPermanent: boolean;
  createdAt: string;
  updatedAt: string;
}
interface ServiceResponse {
  success: boolean;
  links: Link[];
}

const SHORTER_URL = 'https://s.acmcsuf.com'

export const load: PageLoad = async ({ fetch }) => {
  const results: Link[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(`${SHORTER_URL}?page=${page}`);
    const data = (await response.json()) as ServiceResponse;
    if (data.links.length === 0) break;
    results.push(...data.links);
    page++;
  }

  return { links: results };
}
