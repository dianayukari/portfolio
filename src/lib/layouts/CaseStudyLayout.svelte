<script>
	// Reusable case-study layout: title/meta header + ordered content blocks.
	// Swap the work's data without ever touching this file.
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';

	let { work } = $props();
</script>

<article class="work">
	<header class="work-header frame">
		<p class="eyebrow">Case study</p>
		<h1 class="work-title">{work.title}</h1>
		{#if work.summary}
			<p class="work-lede">{work.summary}</p>
		{/if}
		<dl class="work-meta">
			{#if work.role}
				<div><dt>Role</dt><dd>{work.role}</dd></div>
			{/if}
			{#if work.year}
				<div><dt>Year</dt><dd>{work.year}</dd></div>
			{/if}
		</dl>
	</header>

	<div class="work-body frame">
		<BlockRenderer blocks={work.blocks} />
	</div>
</article>

<style>
	.work-header {
		max-width: var(--col-text);
		margin-top: var(--space-5);
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--color-line);
	}
	.work-title {
		font-size: var(--text-2xl);
		font-weight: 500;
		margin-top: var(--space-1);
	}
	.work-lede {
		margin-top: var(--space-2);
		color: var(--color-muted);
		line-height: var(--leading-normal);
	}
	.work-meta {
		display: flex;
		gap: var(--space-4);
		margin-top: var(--space-4);
	}
	.work-meta dt {
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-muted);
		margin-bottom: 2px;
	}
	.work-meta dd {
		font-size: var(--text-sm);
	}

	.work-body {
		/* body content and its inner reading measure */
		max-width: var(--work-max);
		--measure: var(--reading-max);
		margin-top: var(--space-5);
	}
</style>
