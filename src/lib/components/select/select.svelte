<script lang="ts">
  import { slide } from 'svelte/transition';
  export let defaultValue = '';
  export let options: string[] = [];
  export let hrefs: string[] = [];

  let currentValue: string = defaultValue;
  let detailsElement: HTMLDetailsElement;

  function handleOption(term: string) {
    currentValue = term;
    defaultValue = currentValue;
    if (detailsElement) {
      detailsElement.open = false;
    }
  }
</script>

<div class="term">
  <details class="option-box" bind:this={detailsElement}>
    <summary class="selected">
      {currentValue}
    </summary>

    <div class="option" transition:slide|global>
      {#each options as optionValue, i (optionValue)}
        <a
          href={hrefs[i] || '#'}
          class="option-choice"
          on:click={() => handleOption(optionValue)}
          on:keypress={() => handleOption(optionValue)}
          class:pre-selected={currentValue == optionValue}
          tabindex="0"
        >
          {optionValue}
        </a>
      {/each}
    </div>
  </details>
</div>

<style lang="scss">
  .pre-selected {
    opacity: 0.6;
  }

  .term {
    position: relative;
    z-index: 8;
    font-weight: 600;
    .option-box {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      flex-direction: column;
      display: flex;
      justify-content: center;
      font-size: var(--size-sm);
      user-select: none;
      text-align: center;
      width: 9em;

      .option-choice,
      .selected {
        color: var(--button-color);
      }

      .selected {
        display: block;
        list-style: none;
        background-color: var(--button-bg);
        padding: 8px 24px;
        cursor: pointer;
        border-radius: 8px;
        transition: 0.25s ease-in-out;

        &::-webkit-details-marker {
          display: none;
        }

        &:hover {
          background-color: var(--button-bg-hover);
        }
      }

      .option {
        cursor: pointer;
        transition: 0.25s ease-in-out;
        background-color: var(--button-bg);
        padding: 8px 24px;
        margin-top: 0.2rem;
        border-radius: 0 0 8px 8px;

        .option-choice {
          display: block;
          text-align: center;
          cursor: pointer;
          transition: 0.25s ease-in-out;
          text-decoration: none;

          &:hover:not(.pre-selected) {
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }
    }

    .option-box[open] {
      & > .selected {
        border-radius: 8px 8px 0 0;
      }
    }
  }
</style>
