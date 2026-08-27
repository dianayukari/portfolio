<script>
	// Case study: cover image, full header (title/meta/lede/links), then blocks.
	// The rail (WorkShell) holds back-to-index + a TOC whose first entry is the
	// work title; the header itself stays in the main column.
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';
	import WorkLinks from '$lib/components/WorkLinks.svelte';
	import WorkShell from '$lib/components/WorkShell.svelte';
	import { slugify } from '$lib/utils/slug.js';
	import { base } from '$app/paths';

	let { work } = $props();

	const resolve = (p) => (!p || /^https?:\/\//.test(p) ? p : base + p);

	const titleId = $derived(slugify(work.title));
	const headings = $derived([
		{ id: titleId, label: work.title },
		...(work.blocks ?? [])
			.filter((b) => b.type === 'heading')
			.map((b) => ({ id: slugify(b.value), label: b.value }))
	]);
</script>

<WorkShell {headings}>
	{#if work.cover}
		<figure class="work-intro">
			<img src={resolve(work.cover)} alt="" />
		</figure>
	{/if}

	<header class="work-header">
		<p class="eyebrow">Case study</p>
		<h1 class="work-title" id={titleId}>{work.title}</h1>
		{#if work.publication}
			<p class="work-pub">{work.publication}</p>
		{/if}
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
		<WorkLinks links={work.links} />
	</header>

	<div class="work-body">
		<BlockRenderer blocks={work.blocks} />
	</div>
</WorkShell>

<style>
	.work-intro {
		margin: 0 0 var(--space-3);
	}
	.work-intro img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: var(--radius);
	}
	.work-header {
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--color-line);
	}
	.work-title {
		font-size: var(--text-2xl);
		font-weight: 600;
		margin-top: var(--space-1);
		scroll-margin-top: var(--space-4);
	}
	.work-pub {
		margin-top: 2px;
		font-size: var(--text-sm);
		color: var(--color-muted);
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
		color: var(--color-fg);
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
		--measure: var(--col-text);
		margin-top: var(--space-5);
	}
</style>
