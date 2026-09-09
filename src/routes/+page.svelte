<script>
	import { site } from '$lib/content/site.js';
	import { works } from '$lib/content/works/index.js';
	import WorkIndex from '$lib/components/WorkIndex.svelte';
	import WorkGallery from '$lib/components/WorkGallery.svelte';

	// intro and introSecondary can each be a single string or an array of
	// paragraphs. Each paragraph may contain inline HTML (e.g. <a href="…">links
	// </a>), rendered via {@html}. introSecondary is optional.
	const toParagraphs = (value) => (Array.isArray(value) ? value : value ? [value] : []);
	const introParagraphs = toParagraphs(site.intro);
	const secondaryParagraphs = toParagraphs(site.introSecondary);
	// Plain-text version (tags stripped) for the meta description.
	const introText = [...introParagraphs, ...secondaryParagraphs]
		.join(' ')
		.replace(/<[^>]+>/g, '');

	// Which work is hovered, in either column. Owned here because the list and
	// the gallery both read and write it.
	let active = $state(null);
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content={introText} />
</svelte:head>

<div class="home frame">
	<!-- Bio and index share one column, so they line up on both edges. -->
	<div class="home-main">
		<section class="intro">
			<h1 class="intro-name">{site.name}</h1>
			{#each introParagraphs as paragraph}
				<p class="intro-text">{@html paragraph}</p>
			{/each}

			{#if secondaryParagraphs.length}
				<div class="intro-secondary">
					{#each secondaryParagraphs as paragraph}
						<p class="intro-text2">{@html paragraph}</p>
					{/each}
				</div>
			{/if}
		</section>

		<WorkIndex {works} {active} onhover={(key) => (active = key)} />
	</div>

	<WorkGallery {works} {active} onhover={(key) => (active = key)} />
</div>

<style>
	.home {
		/* Width comes from .site.wide in +layout.svelte, so the footer matches. */
		margin-top: var(--space-6);
		display: grid;
		/* Roughly 70/30 — the bio and index still lead, but the gallery gets
		   enough width for the covers to read. */
		grid-template-columns: minmax(0, 2.5fr) minmax(0, 1fr);
		column-gap: var(--space-4);
		align-items: stretch;
	}
	.intro-name {
		font-size: var(--text-2xl);
		/* font-weight: 600; */
	}
	.intro-text {
		margin-top: var(--space-2);
		line-height: var(--leading-normal);
	}
	.intro-text2 {
		line-height: var(--leading-normal);
	}
	/* Background detail — a step down in size and colour, set off by a little
	   extra air rather than a rule. */
	.intro-secondary {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--color-muted);
	}
	.intro-text :global(a) {
		text-decoration: underline;
		text-underline-offset: 2px;
		text-decoration-color: var(--color-line);
		transition: text-decoration-color var(--transition);
	}
	.intro-text :global(a:hover) {
		text-decoration-color: currentColor;
	}

	/* Gallery drops below the index rather than beside it. */
	@media (max-width: 800px) {
		.home {
			grid-template-columns: minmax(0, 1fr);
			row-gap: var(--space-4);
		}
	}
</style>
