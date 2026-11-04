<script lang="ts">
  import { TEAMS } from '$lib/public/board/data';
  import { VISIBLE_TERMS } from '$lib/public/board/data';
  import { termIndex } from '$lib/public/board/utils';
  import Spacing from '$lib/public/legacy/spacing.svelte';
  import TeamIcons from './team-icons.svelte';
  import TeamSection from './team-section.svelte';
  import ScrollToTop from '$lib/components/scroll-to-top/scroll.svelte';
  import { page } from '$app/stores'; // TODO: use '$app/state since page in $app/store is depricated'
  import type { PageData } from './$types';

  export let data: PageData;

  /**
   * @param termCode ex: `F21`, `S22`, etc.
   * @returns `"Fall 2021"`, `"Spring 2022"`, etc.
   */
  function formatTerm(termCode: string) {
    const [termAbbr, yearDigit1, yearDigit2] = termCode.split('');
    const termText = termAbbr === 'S' ? 'Spring' : 'Fall';
    return `${termText} 20${yearDigit1}${yearDigit2}`;
  }

  const formattedTerms = VISIBLE_TERMS.map(formatTerm);

  $: if (data.termIndex !== undefined) {
    $termIndex = data.termIndex;
  }

  const termHrefs = VISIBLE_TERMS.map((term) => {
    const url = new URL($page.url);
    url.searchParams.set('term', term);
    return url.toString();
  });
</script>

<Spacing --min="175px" --med="200px" --max="200px" />

<section id="top" class="hero-container">
  <div class="hero-inner-container">
    <div class="hero-text">
      <h1 class="acm-heavier size-xl">Explore our teams</h1>
      <p>
        Our teams specialize in specific fields in the tech industry. We've designed the teams to be
        gateways for students to explore new fields, develop new interests, and learn new skills
        that will benefit them in the industry.
      </p>
      <p>
        Feel free to reach out to board members through their Discord username, stated below their
        profile.
      </p>
      <div class="board-history">
        {#each VISIBLE_TERMS as termCode, i (termCode)}
          <a href={termHrefs[i]} class="term-chip" class:active={data.termIndex === i}>
            {formattedTerms[i]}
          </a>
        {/each}
      </div>
    </div>
    <img src="/assets/capy-read.svg" alt="Chip the Capybara reading a book" />
  </div>
  <Spacing --min="75px" --med="100px" --max="100px" />
</section>

<TeamIcons term={VISIBLE_TERMS[$termIndex]} />
<Spacing --min="100px" --med="125px" --max="125px" />

<TeamSection info={TEAMS.general} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    The ACM <span class="acm-blue acm-heaviest">general</span> team is a dynamic group of
    individuals driving the success of our organization. ACM
    <span class="acm-blue acm-heaviest">General</span>
    manages operations, organizes events, and ensure the smooth functioning of ACM. They are the backbone
    of our community, fostering collaboration and innovation among members.
  </p>
</TeamSection>

<TeamSection info={TEAMS.ai} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    The <span class="acm-emerald acm-heaviest">artificial intelligence</span> team is dedicated to
    providing accessible information about artificial intelligence and machine learning to all.
    <span class="acm-emerald acm-heaviest">AI</span> focuses on fun projects geared towards beginners
    in the field.
  </p>
</TeamSection>

<TeamSection info={TEAMS.algo} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    The <span class="acm-purple acm-heaviest">algorithm</span> team is dedicated to building
    programming fundamentals within students. <span class="acm-purple acm-heaviest">Algo</span> focuses
    on mastering data structures and algorithms, enhancing problem solving abilities, and exploration
    of competitive programming.
  </p>
</TeamSection>

<TeamSection info={TEAMS.design} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    The <span class="acm-pink acm-heaviest">design</span> team is dedicated to emphasizing the
    importance of product design and product management in the tech industry.
    <span class="acm-pink acm-heaviest">Design</span> focuses on educating students about design principles,
    design tools, and the intricacies of conceptualization, development, and management of a product.
  </p>
</TeamSection>

<TeamSection info={TEAMS.dev} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    The <span class="acm-bluer acm-heaviest">development</span> team is dedicated to giving students
    the opportunity to explore tech via hands-on projects and activities.
    <span class="acm-bluer acm-heaviest">Dev</span> focuses on introducing students to software development,
    and the various tech stacks used in the industry.
  </p>
</TeamSection>

<TeamSection info={TEAMS['gamedev']} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    The <span class="acm-red acm-heaviest">game development</span> team is dedicated to teaching the
    basics of programming in the gaming industry.
    <span class="acm-red acm-heaviest">Gamedev</span> focuses on educating students about design principles,
    design tools, and the development process of a project.
  </p>
</TeamSection>

<TeamSection info={TEAMS.icpc} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    The <span class="acm-orange acm-heaviest"
      >Intercollegiate Competitive Programming Competition</span
    >
    is a contest to challenge students on their algorithms and problem solving skills. The
    <span class="acm-orange acm-heaviest">ICPC</span> Team is dedicated to preparing students for the
    competition by hosting weekly practice sessions and mock contests.
  </p>
</TeamSection>

<TeamSection info={TEAMS.marketing} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    The <span class="acm-blush acm-heaviest">marketing</span> team has a strong passion towards
    advertising and spreading word on all our ACM events.
    <span class="acm-blush acm-heaviest">Marketing</span> utilizes their expertise in digital strategies
    and creative storytelling to display a welcoming environment to all students.
  </p>
</TeamSection>

<TeamSection info={TEAMS.nodebuds} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    Connect & grow with <span class="acm-red acm-heaviest">node buds</span>! Our big-little program
    pairs you with an experienced club officer for social events, workshops, and guidance as you
    navigate the tech world. Build friendships, skills, and have a blast!
  </p>
</TeamSection>

<TeamSection info={TEAMS.oss} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    The <span class="acm-turquoise acm-heaviest">open source </span> team is committed to fostering
    collaboration and innovation in the tech community.
    <span class="acm-turquoise acm-heaviest">Open Source</span> actively contributes to ACM open source
    projects, sharing their expertise and driving advancements in software development.
  </p>
</TeamSection>

<TeamSection info={TEAMS['special-events']} term={VISIBLE_TERMS[$termIndex]}>
  <p slot="content" class="size-md">
    The <span class="acm-lemon acm-heaviest">special events</span> team is all about creating
    unforgettable moments and experiences.
    <span class="acm-lemon acm-heaviest">Special Events</span> plan and execute ex citing events that
    bring our community together, fostering connections and celebrating shared passions.
  </p>
</TeamSection>

<Spacing --min="100px" --med="125px" --max="125px" />

<ScrollToTop />

<style>
  p {
    align-self: start;
  }

  section {
    display: grid;
  }

  section .hero-inner-container {
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    gap: 1em;
    max-width: 1000px;
  }

  section .hero-inner-container .hero-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1em;
  }

  .board-history {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-top: 10px;
  }

  .term-chip {
    padding: 6px 16px;
    font-size: var(--size-xs);
    font-weight: 600;
    text-decoration: none;
    border-radius: 20px;
    border: 2px solid var(--acm-sky);
    color: var(--acm-blue);
    transition: all 0.2s ease-in-out;
  }

  .term-chip:hover {
    background-color: var(--acm-sky);
    color: white;
    transform: translateY(-2px);
  }

  .term-chip.active {
    background-color: var(--acm-blue);
    border-color: var(--acm-blue);
    color: white;
    box-shadow: 0 4px 12px rgba(44, 145, 198, 0.3);
  }

  section .hero-inner-container .hero-text p {
    margin: 0.5em;
    font-size: var(--size-md);
  }

  section .hero-inner-container img {
    max-width: clamp(20rem, 17.342rem + 10.13vw, 30rem);
    justify-self: center;
  }

  @media screen and (min-width: 1000px) {
    section {
      display: grid;
      place-items: center;
      align-items: center;
      max-width: 1280px;
      margin: 0 auto;
    }

    section .hero-inner-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 1em;
    }

    section .hero-inner-container .hero-text {
      align-items: flex-start;
      text-align: start;
      gap: 1em;
    }

    .board-history {
      justify-content: flex-start;
    }

    section .hero-inner-container .hero-text p {
      margin: 0;
    }
  }

  :global(.team-section-container:nth-child(odd)) {
    background-color: var(--acm-even);
  }

  :global(.team-section-container:nth-child(even)) {
    background-color: var(--acm-odd);
  }
</style>
