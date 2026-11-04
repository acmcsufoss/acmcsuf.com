import { Temporal } from 'temporal-polyfill';
import type { ClubEvent } from '$lib/public/events/event';
import { calendar } from '@googleapis/calendar';
import { makeClubEvent } from './event';
import { GCAL_API_KEY, GCAL_ID } from '$lib/server/env';

export function fromGCal(
  events: GCalEvent[],
  refDate = Temporal.Now.zonedDateTimeISO('America/Los_Angeles')
): ClubEvent[] {
  const sortedEvents: ClubEvent[] = [];

  for (const event of events) {
    const clubEvent = makeClubEvent(event, refDate);
    if (clubEvent !== null) {
      sortedEvents.push(clubEvent);
    }
  }

  return sortedEvents;
}

async function fetchPage(cal: ReturnType<typeof calendar>, pageToken?: string) {
  return cal.events.list({
    calendarId: GCAL_ID,
    maxResults: 2500,
    singleEvents: true,
    orderBy: 'startTime',
    showDeleted: false,
    ...(pageToken ? { pageToken } : {}),
  });
}

export type GCalEvent = NonNullable<Awaited<ReturnType<typeof fetchPage>>['data']['items']>[number];

export async function listUpcomingEvents(): Promise<GCalEvent[]> {
  const cal = calendar({
    version: 'v3',
    auth: GCAL_API_KEY,
  });

  const allEvents: GCalEvent[] = [];
  let pageToken: string | undefined;

  do {
    const response = await fetchPage(cal, pageToken);
    const items = response?.data?.items ?? [];
    allEvents.push(...items);
    pageToken = response?.data?.nextPageToken ?? undefined;
  } while (pageToken);

  return allEvents;
}
