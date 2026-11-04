import { VISIBLE_TERMS } from '$lib/public/board/data/terms';
import type { Term } from '$lib/public/board/types';
import type { PageLoad } from './$types';

export function load({ url }: Parameters<PageLoad>[0]) {
  const term = url.searchParams.get('term') as Term | null;
  const termIndex = term ? VISIBLE_TERMS.indexOf(term) : -1;

  return {
    termIndex: termIndex !== -1 ? termIndex : 0,
    termCode: termIndex !== -1 ? (term as string) : (VISIBLE_TERMS[0] as string),
  };
}
