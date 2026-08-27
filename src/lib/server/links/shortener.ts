import type { Handle } from '@sveltejs/kit';

const SHORTLINKS_ORIGIN = 'https://s.acmcsuf.com';

function mergeSearchParams(destination: URL, source: URL): void {
  for (const [key, value] of source.searchParams) {
    destination.searchParams.set(key, value);
  }
}

export function shortener(): Handle {
  return async ({ event, resolve }) => {
    try {
      const url = new URL(event.request.url);

      // Pass to QR code generation endpoint.
      if (url.pathname.toLowerCase().endsWith('.svg')) {
        return resolve(event);
      }

      const shortlinkURL = new URL(`${url.pathname}${url.search}`, SHORTLINKS_ORIGIN);
      const response = await fetch(shortlinkURL, { redirect: 'manual' });
      const location = response.headers.get('location');

      // A non-redirect response means this is a normal acmcsuf.com route.
      if (!location || response.status < 300 || response.status >= 400) {
        return resolve(event);
      }

      const destination = new URL(location, shortlinkURL);
      // Match the old resolver: request query parameters override the link's defaults.
      mergeSearchParams(destination, url);
      return Response.redirect(destination, response.status);
    } catch {
      // The site must remain available if the shortlink service is unavailable.
      return resolve(event);
    }
  };
}
