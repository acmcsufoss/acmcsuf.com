import { error } from '@sveltejs/kit';
import type { PageLoadEvent } from './$types';
import type { RepositoryCertificatePageData } from '$lib/public/certificates';
import { makeRepositoryCertificatePageDataURL } from '$lib/public/certificates/urls';

export async function load({ fetch, params }: PageLoadEvent) {
  const response = await fetch(
    makeRepositoryCertificatePageDataURL(params.username, params.repo_name)
  );

  if (!response.ok) {
    throw error(
      response.status,
      `Could not load ${params.repo_name} contributions for @${params.username}.`
    );
  }

  const data: RepositoryCertificatePageData = await response.json();
  return data;
}
