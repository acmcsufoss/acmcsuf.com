import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [sveltekit(), cloudflare()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
