<script>
	// Reusable blog/article layout: reads like a post — centered narrow measure,
	// dateline, same block schema as a case study.
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';

	let { work } = $props();
</script>

<article class="post frame">
	<header class="post-header">
		<p class="eyebrow">{work.date ?? work.year}</p>
		<h1 class="post-title">{work.title}</h1>
		{#if work.summary}
			<p class="post-lede">{work.summary}</p>
		{/if}
	</header>

	<div class="post-body">
		<BlockRenderer blocks={work.blocks} />
	</div>
</article>

<style>
	.post {
		/* Narrower than a case study — everything reads at article width. */
		max-width: var(--reading-max);
		--measure: var(--reading-max);
		margin-top: var(--space-5);
	}
	.post-header {
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--color-line);
	}
	.post-title {
		font-size: var(--text-2xl);
		font-weight: 500;
		margin-top: var(--space-1);
	}
	.post-lede {
		margin-top: var(--space-2);
		color: var(--color-muted);
		line-height: var(--leading-normal);
	}
	.post-body {
		margin-top: var(--space-4);
	}
</style>
