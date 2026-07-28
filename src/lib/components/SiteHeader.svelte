<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { site } from '$lib/content/site.js';

	// Home shows no header (the homepage has its own big intro); inner pages
	// get a slim persistent header with the name + a link back to the index.
	const isHome = $derived(page.url.pathname === base + '/' || page.url.pathname === base);
</script>

{#if !isHome}
	<header class="site-header frame">
		<a href="{base}/" class="name link-underline">{site.name}</a>
		<a href="{base}/#works" class="index link-underline">Index</a>
	</header>
{/if}

<style>
	.site-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding-top: var(--space-3);
		padding-bottom: var(--space-3);
		font-size: var(--text-sm);
	}
	.name {
		font-weight: 500;
		letter-spacing: var(--tracking-tight);
	}
	.index {
		color: var(--color-muted);
	}
</style>
