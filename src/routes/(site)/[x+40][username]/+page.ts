import { error } from '@sveltejs/kit';
import type { PageLoadEvent } from './$types';
import type { ReleaseCertificatePageData } from '$lib/public/certificates';
import { LATEST, makeReleaseCertificatePageDataURL } from '$lib/public/certificates/urls';

export async function load({ fetch, params, url }: PageLoadEvent) {
  const release = url.searchParams.get('release') ?? LATEST;
  const response = await fetch(makeReleaseCertificatePageDataURL(params.username, release));

  // Errors are returned as JSON too, so parsing without checking breaks the page.
  if (!response.ok) {
    throw error(response.status, `Could not load contributions for @${params.username}.`);
  }

  const data: ReleaseCertificatePageData = await response.json();
  return data;
}
