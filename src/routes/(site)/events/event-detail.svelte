<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import { copy } from '$lib/public/copy/copy';
  import type { ClubEvent } from '$lib/public/events/event';
  import BwIcon from '$lib/components/bw-icon/bw-icon.svelte';

  export let event: ClubEvent;

  const dispatch = createEventDispatcher<{ close: void }>();

  function formatLocation(location?: string | null, hosted = ['Discord', 'Zoom']): string {
    location = location?.trim() ?? '';
    if (location === '') return 'TBD';
    return hosted.includes(location) ? `Hosted on ${location}` : location;
  }

  function handleJoin() {
    window.open(event.meetingLink, '_blank', 'noopener,noreferrer');
  }
</script>

<aside
  class="event-detail"
  style:--highlights={`var(--acm-${event.team}-rgb)`}
  transition:fly={{ x: 300, duration: 250 }}
>
  <div class="detail-header">
    <h3 class="size-md acm-heaviest">Event Details</h3>
    <button class="close-btn" on:click={() => dispatch('close')} aria-label="Close event details">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>

  <div class="detail-body">
    <h2 class="event-title acm-heaviest">{event.title}</h2>

    <div class="event-meta">
      <div class="meta-row">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>{event.month} {event.day}</span>
      </div>

      <div class="meta-row">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{event.startTime} - {event.endTime}</span>
      </div>

      <div class="meta-row">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{formatLocation(event.location)}</span>
      </div>

      {#if event.recurring}
        <div class="meta-row">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          <span>Recurring event</span>
        </div>
      {/if}
    </div>

    <div class="event-description">
      {@html event.description}
    </div>

    {#if !event.hasEnded}
      <button class="join-btn" on:click={handleJoin}> Join Event </button>

      <div class="action-bar">
        <button
          class="action-item"
          title="Copy event link"
          on:click={() =>
            copy(
              event.selfLink,
              'Copied event link to clipboard!',
              'Failed to copy event link to clipboard!',
              event.team
            )}
        >
          <BwIcon src="/assets/copy-link.svg" alt="Copy link" />
        </button>
        <button
          class="action-item"
          title="Copy event summary"
          on:click={() =>
            copy(
              event.summary,
              'Copied event summary to clipboard!',
              'Failed to copy event summary to clipboard!',
              event.team
            )}
        >
          <BwIcon src="/assets/copy-text.svg" alt="Copy summary" />
        </button>
        <button
          class="action-item"
          title="Add to Google Calendar"
          on:click={() =>
            copy(
              event.calendarLinks.google,
              'Copied Google Calendar link to clipboard!',
              'Failed to copy Google Calendar link to clipboard!',
              event.team
            )}
        >
          <BwIcon src="/assets/calendar-google.svg" alt="Google Calendar" />
        </button>
        <button
          class="action-item"
          title="Add to Outlook Calendar"
          on:click={() =>
            copy(
              event.calendarLinks.outlook,
              'Copied Microsoft Outlook calendar link to clipboard!',
              'Failed to copy Microsoft Outlook calendar link to clipboard!',
              event.team
            )}
        >
          <BwIcon src="/assets/calendar-outlook.svg" alt="Outlook Calendar" />
        </button>
      </div>
    {/if}
  </div>
</aside>

<style lang="scss">
  .event-detail {
    width: 360px;
    min-width: 360px;
    height: fit-content;
    max-height: calc(100vh - 240px);
    overflow-y: auto;
    background-color: var(--acm-light);
    border: 2px solid var(--acm-canvas);
    border-radius: 20px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    position: sticky;
    top: 120px;
  }

  :global(html[data-theme='dark']) .event-detail {
    --acm-light: #1e2432;
    --acm-canvas: #2a3142;
  }

  @media (prefers-color-scheme: dark) {
    :global(html:not([data-theme='light'])) .event-detail {
      --acm-light: #1e2432;
      --acm-canvas: #2a3142;
    }
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--acm-canvas);
    position: sticky;
    top: 0;
    background-color: var(--acm-light);
    border-radius: 20px 20px 0 0;
    z-index: 1;

    h3 {
      color: var(--acm-dark);
    }
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background-color: transparent;
    color: var(--acm-dark);
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }

  .close-btn:hover {
    background-color: var(--acm-canvas);
  }

  .detail-body {
    padding: 20px;
  }

  .event-title {
    font-size: var(--size-md);
    color: var(--acm-dark);
    line-height: 1.3;
    margin-bottom: 16px;
  }

  .event-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: var(--size-xs);
    color: var(--acm-dark);

    svg {
      flex-shrink: 0;
      stroke: rgb(var(--highlights));
    }
  }

  .event-description {
    font-size: var(--size-xs);
    line-height: 1.6;
    color: var(--acm-dark);
    margin-bottom: 20px;
    overflow-wrap: break-word;
    opacity: 0.85;
  }

  .event-description:empty::after {
    content: 'No description available.';
    opacity: 0.6;
    font-style: italic;
  }

  .join-btn {
    display: block;
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 12px;
    background-color: rgb(var(--highlights));
    color: var(--perma-light);
    font-family: 'Poppins', 'Verdana', 'Helvetica', sans-serif;
    font-size: var(--size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    margin-bottom: 16px;
  }

  .join-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(var(--highlights), 0.4);
  }

  .action-bar {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .action-item {
    --size: 36px;
    width: var(--size);
    height: var(--size);
    padding: calc(var(--size) * 0.15);
    border-radius: 50%;
    border: 1.5px solid var(--acm-canvas);
    background-color: var(--acm-light);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-item:hover {
    border-color: rgb(var(--highlights));
    box-shadow: 0 2px 8px rgba(var(--highlights), 0.3);
    transform: translateY(-2px);
  }

  /* Mobile */
  @media (max-width: 899px) {
    .event-detail {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      min-width: unset;
      max-height: 70vh;
      border-radius: 20px 20px 0 0;
      border-bottom: none;
      z-index: 100;
      box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.15);
    }

    .detail-header {
      border-radius: 20px 20px 0 0;
    }
  }
</style>
