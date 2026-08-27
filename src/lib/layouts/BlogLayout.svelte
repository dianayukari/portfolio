<script>
	// Blog/article: full header (date/title/lede/links) + content blocks. The
	// rail (WorkShell) holds back-to-index + a TOC whose first entry is the
	// work title.
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';
	import WorkLinks from '$lib/components/WorkLinks.svelte';
	import WorkShell from '$lib/components/WorkShell.svelte';
	import { slugify } from '$lib/utils/slug.js';

	let { work } = $props();

	const titleId = $derived(slugify(work.title));
	const headings = $derived([
		{ id: titleId, label: work.title },
		...(work.blocks ?? [])
			.filter((b) => b.type === 'heading')
			.map((b) => ({ id: slugify(b.value), label: b.value }))
	]);
</script>

<WorkShell {headings} mainWidth="var(--reading-max)">
	<header class="post-header">
		<p class="eyebrow">{work.date ?? work.year}</p>
		<h1 class="post-title" id={titleId}>{work.title}</h1>
		{#if work.publication}
			<p class="post-pub">{work.publication}</p>
		{/if}
		{#if work.summary}
			<p class="post-lede">{work.summary}</p>
		{/if}
		<WorkLinks links={work.links} />
	</header>

	<div class="post-body">
		<BlockRenderer blocks={work.blocks} />
	</div>
</WorkShell>

<style>
	.post-header {
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--color-line);
	}
	.post-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		margin-top: var(--space-1);
		scroll-margin-top: var(--space-4);
	}
	.post-pub {
		margin-top: 2px;
		font-size: var(--text-sm);
		color: var(--color-muted);
	}
	.post-lede {
		margin-top: var(--space-2);
		color: var(--color-muted);
		line-height: var(--leading-normal);
	}
	.post-body {
		--measure: var(--reading-max);
		margin-top: var(--space-4);
	}
</style>
