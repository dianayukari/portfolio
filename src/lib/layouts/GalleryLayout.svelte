<script>
	// Gallery: full header (title/meta/links) + a media grid with a click-to-zoom
	// lightbox. The rail (WorkShell) holds back-to-index + a TOC (just the title,
	// since galleries have no sections).
	import MediaFigure from '$lib/components/MediaFigure.svelte';
	import WorkLinks from '$lib/components/WorkLinks.svelte';
	import WorkShell from '$lib/components/WorkShell.svelte';
	import { slugify } from '$lib/utils/slug.js';

	let { work } = $props();

	const titleId = $derived(slugify(work.title));
	const headings = $derived([{ id: titleId, label: work.title }]);

	let zoomed = $state(null); // { url, caption, alt } | null
	const close = () => (zoomed = null);
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') close();
	}}
/>

<WorkShell {headings}>
	<header class="gallery-header">
		<p class="eyebrow">Gallery — {work.year}</p>
		<h1 class="gallery-title" id={titleId}>{work.title}</h1>
		{#if work.publication}
			<p class="gallery-pub">{work.publication}</p>
		{/if}
		{#if work.summary}
			<p class="gallery-lede">{work.summary}</p>
		{/if}
		<WorkLinks links={work.links} />
	</header>

	<div class="gallery-grid">
		{#each work.media as item}
			<div class="cell cell--{item.span ?? 'half'}">
				<MediaFigure {...item} onzoom={item.type === 'image' ? (m) => (zoomed = m) : undefined} />
			</div>
		{/each}
	</div>
</WorkShell>

{#if zoomed}
	<!-- Lightbox -->
	<div
		class="lightbox"
		role="button"
		tabindex="0"
		aria-label="Close image"
		onclick={close}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') close();
		}}
	>
		<figure>
			<img src={zoomed.url} alt={zoomed.alt || zoomed.caption} />
			{#if zoomed.caption}<figcaption>{zoomed.caption}</figcaption>{/if}
		</figure>
	</div>
{/if}

<style>
	.gallery-header {
		padding-bottom: var(--space-4);
	}
	.gallery-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		margin-top: var(--space-1);
		scroll-margin-top: var(--space-4);
	}
	.gallery-pub {
		margin-top: 2px;
		font-size: var(--text-sm);
		color: var(--color-muted);
	}
	.gallery-lede {
		margin-top: var(--space-2);
		color: var(--color-muted);
		line-height: var(--leading-normal);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
	}
	.cell--full {
		grid-column: 1 / -1;
	}
	@media (max-width: 620px) {
		.gallery-grid {
			grid-template-columns: 1fr;
		}
		.cell--full {
			grid-column: auto;
		}
	}

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--page-pad);
		background: color-mix(in srgb, var(--color-fg) 92%, transparent);
		cursor: zoom-out;
		animation: fade var(--transition);
	}
	.lightbox figure {
		margin: 0;
		max-width: 90vw;
		max-height: 88vh;
		/* A long caption widens the figure; keep the image centered within it
		   (a block image would otherwise sit at the left of the wide box). */
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.lightbox img {
		max-width: 90vw;
		max-height: 80vh;
		object-fit: contain;
		border-radius: var(--radius);
	}
	.lightbox figcaption {
		margin-top: var(--space-1);
		max-width: 25rem;
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-bg);
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
</style>
