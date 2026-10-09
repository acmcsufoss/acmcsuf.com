<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/button/button.svelte';
  import Bar from '$lib/components/nav/bar.svelte';
  import Footer from '$lib/components/footer/footer.svelte';
  import { onMount } from 'svelte';
  import { AcmTheme, theme } from '$lib/public/legacy/theme';

  function changeTheme(event: MediaQueryListEvent) {
    theme.set(event.matches ? AcmTheme.Dark : AcmTheme.Light);
  }

  onMount(() => {
    theme.init();
    if ('matchMedia' in window) {
      const mediaList = matchMedia('(prefers-color-scheme: dark)');
      mediaList.addEventListener('change', changeTheme);
      return () => mediaList.removeEventListener('change', changeTheme);
    }
  });
</script>

<Bar />

<svelte:head>
  <title>ACM at CSUF / {$page.status || 404}</title>
</svelte:head>

<section title={$page.error?.message}>
  <div class="container">
    <div class="content-container">
      <div class="text-container">
        <h1>{$page.status}</h1>
        {#if $page.status === 505}
          <h2>Interesting HTTP protocol you got there.</h2>
        {:else if $page.status === 504}
          <h2>Your gateway took too long.</h2>
        {:else if $page.status === 503}
          <h2>We might be down for maintenance. Check back later!</h2>
        {:else if $page.status === 502}
          <h2>Your gateway got on the wrong bus.</h2>
        {:else if $page.status === 501}
          <h2>We didn't implement this yet LOL</h2>
        {:else if $page.status === 500}
          <h2>Something went wrong on our end..</h2>
        {:else if $page.status == 429}
          <h2>You're asking too much</h2>
        {:else if $page.status == 413}
          <h2>That's too much information</h2>
        {:else if $page.status === 404}
          <h2>Can't find where you're going?</h2>
        {:else if $page.status === 403}
          <h2>YOU SHALL NOT PASS!!</h2>
        {:else if $page.status === 402}
          <h2>Give us your money!</h2>
        {:else if $page.status === 401}
          <h2>Sorry, you're not built for this page.</h2>
        {:else if $page.status === 400}
          <h2>Your request is in another castle.</h2>
        {/if}
        <h2 class="gap">Head home!</h2>
        <Button text="Return to Home" link="/" />
      </div>
      <img src="/assets/capy-meme.svg" alt="404 - Page Not Found" />
    </div>
  </div>
</section>

<Footer />

<style>
  .container {
    height: 700px;
    text-align: center;
    padding-top: 100px;
  }

  h1 {
    font-size: 100px;
    text-shadow: var(--acm-blue) 2px 2px;
    line-height: 1;
  }

  h2 {
    font-size: 1.2rem;
  }

  .gap {
    margin-bottom: 20px;
  }
  section img {
    max-width: 80%;
    min-width: 230px;
    height: auto;
  }

  .text-container {
    min-width: 205px;
  }

  .content-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    width: 80%;
    height: 80%;
    margin: auto;
  }

  /* min-width: 480px */
  @media screen and (min-width: 550px) {
    .content-container {
      flex-direction: row-reverse;
    }
  }
</style>
