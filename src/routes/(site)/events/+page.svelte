<script lang="ts">
  import type { PageData } from './$types';
  import type { ClubEvent } from '$lib/public/events/event';
  import Block from '$lib/components/block/block.svelte';
  import Spacing from '$lib/public/legacy/spacing.svelte';
  import EventCalendar from './calendar.svelte';
  import EventDetail from './event-detail.svelte';

  export let data: PageData;

  let selectedEvent: ClubEvent | null = null;

  function handleEventSelect(e: CustomEvent<ClubEvent>) {
    selectedEvent = e.detail;
  }

  function handleClose() {
    selectedEvent = null;
  }
</script>

<svelte:head>
  <title>Events | ACM at CSUF</title>
</svelte:head>

<Spacing --min="175px" --med="200px" --max="200px" />

<Block>
  <h2 slot="headline" class="size-lg">Curated events for growth and success</h2>
  <p slot="text" class="size-md">
    Our student chapter hosts a multitude of events throughout each school semester, consisting of
    workshops, info sessions, community building events, and much more!
    <br /><br />
    <span class="acm-heavy"
      >Events are open to anyone interested, regardless of major or background experience.</span
    >
  </p>
</Block>

<Spacing --min="40px" --med="60px" --max="80px" />

<div class="main-header">
  <h2 class="size-lg acm-heavier">Our Events</h2>
  <img src="assets/bluecalendar.svg" alt="Blue Calendar" />
</div>

<Spacing --med="16px" />

<section class="calendar-section">
  <div class="calendar-layout" class:has-detail={selectedEvent !== null}>
    <EventCalendar events={data.events} on:select={handleEventSelect} />

    {#if selectedEvent}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="mobile-overlay" on:click={handleClose}></div>
      <EventDetail event={selectedEvent} on:close={handleClose} />
    {/if}
  </div>
</section>

<Spacing --min="8px" --med="63px" --max="88px" />

<style lang="scss">
  .main-header {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    flex-direction: row;

    img {
      display: block;
      margin-left: 10px;
      width: 30px;
      height: 30px;
    }
  }

  p {
    text-align: center;
  }

  .calendar-section {
    display: flex;
    justify-content: center;
    padding: 0 20px;
  }

  .calendar-layout {
    display: flex;
    gap: 24px;
    width: 100%;
    max-width: 1280px;
    align-items: flex-start;
  }

  .mobile-overlay {
    display: none;
  }

  @media (max-width: 899px) {
    .calendar-layout {
      flex-direction: column;
    }

    .mobile-overlay {
      display: block;
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 99;
    }
  }

  @media (max-width: 300px) {
    .main-header {
      img {
        display: none;
      }
    }
  }
</style>
