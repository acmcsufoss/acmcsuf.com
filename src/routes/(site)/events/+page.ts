import type { PageLoadEvent } from './$types';
import type { ClubEvent } from '$lib/public/events/event';

export async function load({ fetch }: PageLoadEvent) {
  const response = await fetch(`/events/all.json`);
  if (!response.ok || response.status === 204) {
    return { events: [] as ClubEvent[] };
  }
  const events: ClubEvent[] = await response.json();
  return { events };
}
