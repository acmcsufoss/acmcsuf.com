<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import type { ClubEvent } from '$lib/public/events/event';

  export let events: ClubEvent[] = [];

  const dispatch = createEventDispatcher<{ select: ClubEvent }>();

  let calendarEl: HTMLDivElement;
  let calendar: Calendar;

  // Team color resolution — uses global CSS variables so dark mode & the
  // `/colors` page remain the single source of truth.
  // See src/lib/assets/global.json and https://acmcsuf.com/colors.
  const KNOWN_TEAMS = new Set([
    'general',
    'ai',
    'algo',
    'design',
    'dev',
    'gamedev',
    'icpc',
    'marketing',
    'oss',
    'special-events',
    'nodebuds',
  ]);

  function teamColor(team: string): string {
    const key = KNOWN_TEAMS.has(team) ? team : 'general';
    return `rgb(var(--acm-${key}-rgb))`;
  }

  // Short display labels for teams
  const TEAM_LABELS: Record<string, string> = {
    general: 'General',
    ai: 'AI',
    algo: 'Algo',
    design: 'Design',
    dev: 'Dev',
    gamedev: 'Game Dev',
    icpc: 'ICPC',
    marketing: 'Marketing',
    oss: 'Open Source',
    'special-events': 'Special Event',
    nodebuds: 'Node Buds',
  };

  // Remove the space inside "4:00 PM" so it renders as "4:00PM"
  function compactTime(time: string): string {
    return time.replace(/\s+/g, '');
  }

  // Strip the temporal bracket from date strings
  function toISODate(temporalDate: string): string {
    return temporalDate.replace(/\[.*\]$/, '');
  }

  function clubEventsToFCEvents(clubEvents: ClubEvent[]) {
    return clubEvents.map((event) => {
      const color = teamColor(event.team);
      const label = TEAM_LABELS[event.team] ?? 'General';
      const time = compactTime(event.startTime);
      return {
        id: event.id,
        title: `${time} ${label}`,
        start: toISODate(event.date),
        backgroundColor: color,
        borderColor: color,
        extendedProps: { clubEvent: event },
      };
    });
  }

  const MOBILE_QUERY = '(max-width: 640px)';
  let mq: MediaQueryList | null = null;

  function getToolbarOptions(isMobile: boolean) {
    if (isMobile) {
      return {
        headerToolbar: { left: 'prev', center: 'title', right: 'next' },
        footerToolbar: { center: 'dayGridWeek,today,dayGridMonth' },
      } as const;
    }
    return {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek',
      },
      footerToolbar: false,
    } as const;
  }

  function handleViewportChange() {
    if (!calendar || !mq) return;
    const opts = getToolbarOptions(mq.matches);
    calendar.setOption('headerToolbar', opts.headerToolbar);
    calendar.setOption('footerToolbar', opts.footerToolbar);
  }

  onMount(() => {
    mq = window.matchMedia(MOBILE_QUERY);
    const initial = getToolbarOptions(mq.matches);

    calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: clubEventsToFCEvents(events),
      headerToolbar: initial.headerToolbar,
      footerToolbar: initial.footerToolbar,
      height: 'auto',
      fixedWeekCount: false,
      eventDisplay: 'list-item',
      displayEventTime: false,
      dayMaxEvents: 3,
      eventClick(info) {
        info.jsEvent.preventDefault();
        const clubEvent = info.event.extendedProps.clubEvent as ClubEvent;
        dispatch('select', clubEvent);
      },
      eventDidMount(info) {
        info.el.style.cursor = 'pointer';
      },
    });

    calendar.render();
    mq.addEventListener('change', handleViewportChange);
  });

  onDestroy(() => {
    if (mq) {
      mq.removeEventListener('change', handleViewportChange);
    }
    if (calendar) {
      calendar.destroy();
    }
  });

  $: if (calendar) {
    calendar.removeAllEvents();
    calendar.addEventSource(clubEventsToFCEvents(events));
  }
</script>

<div class="calendar-wrapper">
  <div bind:this={calendarEl} class="calendar-el"></div>
</div>

<style lang="scss">
  .calendar-wrapper {
    flex: 1;
    min-width: 0;
    background-color: var(--acm-light);
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  :global(html[data-theme='dark']) .calendar-wrapper {
    --acm-light: #1e2432;
    --acm-canvas: #2a3142;
  }

  @media (prefers-color-scheme: dark) {
    :global(html:not([data-theme='light'])) .calendar-wrapper {
      --acm-light: #1e2432;
      --acm-canvas: #2a3142;
    }
  }

  .calendar-el {
    font-family: 'Poppins', 'Verdana', 'Helvetica', sans-serif;
  }

  /* FullCalendar overrides */
  .calendar-wrapper :global {
    /* Buttons */
    .fc .fc-button {
      font-family: 'Poppins', 'Verdana', 'Helvetica', sans-serif;
      background-color: var(--acm-blue);
      border-color: var(--acm-blue);
      color: var(--perma-light);
      border-radius: 8px;
      font-weight: 500;
      font-size: var(--size-xs);
      padding: 6px 14px;
      text-transform: capitalize;
      transition: all 0.2s ease-in-out;
    }

    .fc .fc-button:hover {
      background-color: var(--acm-sky);
      border-color: var(--acm-sky);
    }

    .fc .fc-button:focus {
      box-shadow: 0 0 0 3px rgba(var(--acm-blue-rgb), 0.4);
    }

    .fc .fc-button-primary:not(:disabled).fc-button-active,
    .fc .fc-button-primary:not(:disabled):active {
      background-color: var(--acm-darker);
      border-color: var(--acm-darker);
    }

    /* Prev/Next navigation buttons — minimal style */
    .fc .fc-prev-button,
    .fc .fc-next-button {
      background-color: transparent;
      border: 2px solid var(--acm-blue);
      color: var(--acm-blue);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .fc .fc-prev-button:hover,
    .fc .fc-next-button:hover {
      background-color: var(--acm-blue);
      border-color: var(--acm-blue);
      color: var(--perma-light);
    }

    .fc .fc-prev-button:focus,
    .fc .fc-next-button:focus {
      box-shadow: 0 0 0 3px rgba(var(--acm-blue-rgb), 0.3);
    }

    /* Today — outlined style so it doesn't blend with the solid-blue view toggles.
       Border-radius intentionally omitted so it inherits the surrounding button-group
       shape (0 between siblings, 8px standalone on desktop). */
    .fc .fc-button-primary.fc-today-button,
    .fc .fc-button-primary.fc-today-button:disabled {
      background-color: var(--acm-light);
      border-color: var(--acm-blue);
      color: var(--acm-blue);
    }

    .fc .fc-button-primary.fc-today-button:hover:not(:disabled) {
      background-color: var(--acm-blue);
      border-color: var(--acm-blue);
      color: var(--perma-light);
    }

    .fc .fc-button-primary.fc-today-button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    /* Title */
    .fc .fc-toolbar-title {
      font-family: 'Poppins', 'Verdana', 'Helvetica', sans-serif;
      font-size: var(--size-lg);
      font-weight: 700;
      color: var(--acm-blue);
    }

    /* Grid */
    .fc {
      --fc-border-color: var(--acm-canvas);
      --fc-today-bg-color: rgba(var(--acm-blue-rgb), 0.08);
      --fc-page-bg-color: var(--acm-light);
      --fc-neutral-bg-color: var(--acm-light);
      --fc-list-event-hover-bg-color: rgba(var(--acm-blue-rgb), 0.1);
    }

    .fc .fc-col-header-cell {
      background-color: var(--acm-canvas);
      padding: 8px 0;
    }

    .fc .fc-col-header-cell-cushion {
      font-family: 'Poppins', 'Verdana', 'Helvetica', sans-serif;
      font-weight: 600;
      font-size: var(--size-xs);
      color: var(--acm-dark);
      text-decoration: none;
    }

    .fc .fc-daygrid-day-number {
      font-family: 'Poppins', 'Verdana', 'Helvetica', sans-serif;
      font-weight: 500;
      font-size: var(--size-xs);
      color: var(--acm-dark);
      text-decoration: none;
      padding: 6px 8px;
    }

    .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
      color: var(--acm-blue);
      font-weight: 700;
    }

    /* Day cells */
    .fc .fc-daygrid-day {
      background-color: var(--acm-light);
      transition: background-color 0.15s ease-in-out;
    }

    .fc .fc-daygrid-day:hover {
      background-color: rgba(var(--acm-blue-rgb), 0.04);
    }

    .fc .fc-daygrid-day-frame {
      min-height: 100px;
    }

    /* Dot-style events */
    .fc .fc-daygrid-event {
      font-size: 0.8em;
      padding: 2px 4px;
      margin: 1px 2px;
      transition: background-color 0.15s ease-in-out;
      border-radius: 4px;
    }

    .fc .fc-daygrid-event:hover {
      background-color: var(--acm-canvas);
    }

    /* Make the event dot a true circle */
    .fc .fc-daygrid-event-dot {
      border-width: 5px;
      border-radius: 50%;
      margin: 0 6px 0 2px;
    }

    .fc .fc-daygrid-dot-event .fc-event-title {
      font-weight: 500;
      color: var(--acm-dark);
    }

    /* More link */
    .fc .fc-daygrid-more-link {
      font-family: 'Poppins', 'Verdana', 'Helvetica', sans-serif;
      font-weight: 600;
      color: var(--acm-blue);
      font-size: var(--size-xs);
    }

    /* Popover */
    .fc .fc-popover {
      border-radius: 12px;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
      border: 1px solid var(--acm-canvas);
      background-color: var(--acm-light);
    }

    .fc .fc-popover-header {
      font-family: 'Poppins', 'Verdana', 'Helvetica', sans-serif;
      font-weight: 600;
      background-color: var(--acm-canvas);
      border-radius: 12px 12px 0 0;
      padding: 8px 12px;
      color: var(--acm-dark);
    }

    /* Scrollbar */
    .fc .fc-scroller {
      overflow: auto !important;
    }

    /* Toolbar */
    .fc .fc-toolbar {
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px !important;
    }

    .fc .fc-toolbar-chunk {
      display: flex;
      align-items: center;
    }

    /* Button groups */
    .fc .fc-button-group > .fc-button {
      border-radius: 0;
    }

    .fc .fc-button-group > .fc-button:first-child {
      border-radius: 8px 0 0 8px;
    }

    .fc .fc-button-group > .fc-button:last-child {
      border-radius: 0 8px 8px 0;
    }

    /* Other days */
    .fc .fc-day-other .fc-daygrid-day-number {
      opacity: 0.4;
    }

    /* Footer toolbar (only rendered on mobile via JS) */
    .fc .fc-footer-toolbar {
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    }

    /* Mobile responsive */
    @media (max-width: 640px) {
      /* Reorder so the footer toolbar (week/today/month) sits under the title
         and above the calendar grid, instead of below the grid. */
      .fc {
        display: flex;
        flex-direction: column;
      }
      .fc .fc-header-toolbar {
        order: 0;
        margin-bottom: 8px !important;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }
      .fc .fc-header-toolbar .fc-toolbar-chunk {
        display: flex;
        align-items: center;
      }
      .fc .fc-header-toolbar .fc-toolbar-title {
        margin: 0;
        line-height: 1;
      }
      .fc .fc-footer-toolbar {
        order: 1;
        margin-top: 0 !important;
        margin-bottom: 12px !important;
      }
      .fc .fc-view-harness {
        order: 2;
      }

      .fc .fc-toolbar-title {
        font-size: var(--size-md);
        text-align: center;
      }

      .fc .fc-button {
        font-size: 0.7rem;
        padding: 4px 10px;
      }

      .fc .fc-prev-button,
      .fc .fc-next-button {
        width: 32px;
        height: 32px;
      }

      .fc .fc-daygrid-day-number {
        padding: 4px 6px;
        font-size: 0.7rem;
      }

      .fc .fc-col-header-cell {
        padding: 4px 0;
      }

      .fc .fc-col-header-cell-cushion {
        font-size: 0.65rem;
      }

      .fc .fc-daygrid-event {
        font-size: 0.65rem;
      }

      .fc .fc-daygrid-day-frame {
        min-height: 70px;
      }
    }
  }
</style>
