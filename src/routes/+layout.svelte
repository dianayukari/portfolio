<script>
	import '../app.css';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { children } = $props();

	// The homepage runs on a wider column than the rest of the site (it carries
	// the gallery). Set here rather than on the page itself so everything in the
	// layout — the footer especially — lines up with the same edges.
	const path = $derived(page.url.pathname);
	const wide = $derived(path === base + '/' || path === base);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="site" class:wide>
	<SiteHeader />
	<main>
		{@render children()}
	</main>
	<SiteFooter />
</div>

<style>
	.site {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	/* Widens every .frame inside the layout, content and footer alike. */
	.site.wide {
		--content-max: var(--col-media);
	}
	main {
		flex: 1 0 auto;
	}
</style>
