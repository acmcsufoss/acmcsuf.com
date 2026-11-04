import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

const SHORTLINKS_ORIGIN = 'https://s.acmcsuf.com';

export async function GET(event: RequestEvent) {
  const url = new URL(event.request.url);
  const response = await fetch(new URL(url.pathname, SHORTLINKS_ORIGIN));
  if (!response.ok) {
    throw error(404, 'Invalid link');
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'image/svg+xml',
    },
  });
}
