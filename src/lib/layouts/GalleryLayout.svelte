<script>
	// Reusable gallery layout: a two-column media grid of images + videos with a
	// click-to-zoom lightbox. Items span one or both columns via `span`.
	import MediaFigure from '$lib/components/MediaFigure.svelte';

	let { work } = $props();

	let zoomed = $state(null); // { url, caption, alt } | null
	const close = () => (zoomed = null);
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') close();
	}}
/>

<article class="gallery frame">
	<header class="gallery-header">
		<p class="eyebrow">Gallery — {work.year}</p>
		<h1 class="gallery-title">{work.title}</h1>
		{#if work.summary}
			<p class="gallery-lede">{work.summary}</p>
		{/if}
	</header>

	<div class="gallery-grid">
		{#each work.media as item}
			<div class="cell cell--{item.span ?? 'half'}">
				<MediaFigure {...item} onzoom={item.type === 'image' ? (m) => (zoomed = m) : undefined} />
			</div>
		{/each}
	</div>
</article>

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
	.gallery {
		max-width: var(--col-media);
		margin-top: var(--space-5);
	}
	.gallery-header {
		max-width: var(--col-text);
		padding-bottom: var(--space-4);
	}
	.gallery-title {
		font-size: var(--text-2xl);
		font-weight: 500;
		margin-top: var(--space-1);
	}
	.gallery-lede {
		margin-top: var(--space-2);
		color: var(--color-muted);
		line-height: var(--leading-normal);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2);
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
		display: grid;
		place-items: center;
		padding: var(--page-pad);
		background: color-mix(in srgb, var(--color-fg) 92%, transparent);
		cursor: zoom-out;
		animation: fade var(--transition);
	}
	.lightbox figure {
		margin: 0;
		max-width: 90vw;
		max-height: 88vh;
	}
	.lightbox img {
		max-width: 90vw;
		max-height: 80vh;
		object-fit: contain;
		border-radius: var(--radius);
	}
	.lightbox figcaption {
		margin-top: var(--space-1);
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
