<script lang="ts">
  import { TEAMS_JSON, OFFICERS_JSON, isTeamVisibleForTerm } from '$lib/public/board/data';
  import { TEAMS } from '$lib/public/board/data';
  import type { Term } from '$lib/public/board/types';

  export let term: Term;

  /** Teams to display as navigation icons (in order). */
  const NAV_TEAMS = TEAMS_JSON.filter((t) => t.id);

  $: visibleTeams = NAV_TEAMS.filter((team) =>
    isTeamVisibleForTerm(team.id, term, OFFICERS_JSON, TEAMS[team.id]?.tiers)
  );
</script>

<section class="team-container">
  <div class="team-icons-inner-container">
    {#each visibleTeams as team (team.id)}
      <div class="icon">
        <a href={`#${team.id}`} class={team.id}>
          <img src={team.logoSrc} alt={`${team.id}-logo`} width="125px" height="125px" />
        </a>
        <p class="acm-heaviest">{team.title}</p>
      </div>
    {/each}
  </div>
</section>

<style>
  section .team-icons-inner-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
    column-gap: 50px;
    row-gap: 30px;
    justify-content: center;
    padding: 10px;
  }

  section .team-icons-inner-container .icon {
    display: grid;
    align-items: center;
    text-align: center;
    padding: 10px;
  }

  section .team-icons-inner-container .icon a {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  section .team-icons-inner-container .general :hover {
    cursor: pointer;
    transform: scale(1.07);
    filter: brightness(97%);
  }

  section .team-icons-inner-container a :hover {
    cursor: pointer;
    transform: scale(1.07);
    filter: brightness(95%);
  }

  section .team-icons-inner-container .general :active {
    filter: brightness(92%);
  }

  section .team-icons-inner-container a :active {
    filter: brightness(90%);
  }

  section .team-icons-inner-container .icon a img {
    width: 100%;
    height: auto;
  }

  section .team-icons-inner-container .icon p {
    width: auto;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  @media screen and (min-width: 1000px) {
    section {
      display: grid;
      place-items: center;
      align-items: center;
      max-width: 1280px;
      margin: 0 auto;
    }

    section .team-icons-inner-container {
      grid-template-columns: repeat(5, minmax(125px, 1fr));
    }
  }
</style>
