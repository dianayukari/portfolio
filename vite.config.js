import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// All SvelteKit/Svelte config lives in svelte.config.js. Passing options to
// sveltekit() here would cause SvelteKit to ignore svelte.config.js entirely.
export default defineConfig({
	plugins: [sveltekit()]
});
