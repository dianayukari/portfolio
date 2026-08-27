<script>
	import { site } from '$lib/content/site.js';
	import { works } from '$lib/content/works/index.js';
	import WorkIndex from '$lib/components/WorkIndex.svelte';

	// intro can be a single string or an array of paragraphs. Each paragraph may
	// contain inline HTML (e.g. <a href="…">links</a>), rendered via {@html}.
	const introParagraphs = Array.isArray(site.intro) ? site.intro : [site.intro];
	// Plain-text version (tags stripped) for the meta description.
	const introText = introParagraphs.join(' ').replace(/<[^>]+>/g, '');
</script>

<svelte:head>
	<title>{site.name} — {site.role}</title>
	<meta name="description" content={introText} />
</svelte:head>

<section class="intro frame">
	<h1 class="intro-name">{site.name}</h1>
	{#each introParagraphs as paragraph}
		<p class="intro-text">{@html paragraph}</p>
	{/each}
</section>

<WorkIndex {works} />

<style>
	.intro {
		margin-top: var(--space-6);
	}
	.intro-name {
		font-size: var(--text-2xl);
		font-weight: 600;
	}
	.intro-text {
		margin-top: var(--space-2);
		line-height: var(--leading-normal);
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

</style>
