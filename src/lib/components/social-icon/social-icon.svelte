<script lang="ts">
  export let src: string;
  export let alt: string;
  export let width = 32;
  export let height = width;
</script>

<div
  role="img"
  aria-label={alt}
  class="social-icon"
  style:--icon-url="url({src})"
  style:--size-w="{width}px"
  style:--size-h="{height}px"
/>

<style lang="scss">
  .social-icon {
    width: var(--size-w);
    height: var(--size-h);
    display: inline-block;

    mask: var(--icon-url) no-repeat center / contain;
    -webkit-mask: var(--icon-url) no-repeat center / contain;

    background-color: var(--icon-color, #ffffff);

    transition: background-color 0.25s ease-in-out;
  }
</style>
