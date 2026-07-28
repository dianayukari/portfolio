import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	// Force runes mode for our own components; libraries in node_modules opt out.
	vitePlugin: {
		dynamicCompileOptions({ filename }) {
			if (!filename.split(/[/\\]/).includes('node_modules')) {
				return { runes: true };
			}
		}
	},

	kit: {
		// Static output for GitHub Pages. Every route is prerendered to a flat
		// HTML file at build time (see src/routes/+layout.js).
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),

		// Hosted on a custom domain (dianayukari.com), so the site lives at the
		// domain root — no base path needed. If you ever move to a project page
		// like user.github.io/portfolio, set base to '/portfolio' here.
		paths: {
			base: ''
		},

		prerender: {
			// Placeholder work media (under /static/works/…) doesn't exist yet.
			// Warn instead of failing the build on missing assets. Real broken
			// internal page links still surface as warnings here.
			handleHttpError: 'warn'
		}
	}
};

export default config;
