<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { site } from '$lib/content/site.js';

	// No global header on the homepage (it has its own intro) or on work pages
	// (their rail carries the back-to-index link). Other pages get the slim bar.
	const path = $derived(page.url.pathname);
	const hidden = $derived(
		path === base + '/' || path === base || path.startsWith(base + '/work')
	);
</script>

{#if !hidden}
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
		color: var(--color-fg);
	}
	.index {
		color: var(--color-muted);
	}
</style>
