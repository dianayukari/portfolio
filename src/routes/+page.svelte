<script>
	import { site } from '$lib/content/site.js';
	import { works } from '$lib/content/works/index.js';
	import WorkIndex from '$lib/components/WorkIndex.svelte';
</script>

<svelte:head>
	<title>{site.name} — {site.role}</title>
	<meta name="description" content={site.intro} />
</svelte:head>

<section class="intro frame">
	<h1 class="intro-name">{site.name}</h1>
	<p class="intro-text">{site.intro}</p>
</section>

<WorkIndex {works} />

<style>
	.intro {
		margin-top: var(--space-6);
	}
	.intro-name {
		font-size: var(--text-2xl);
		font-weight: 500;
	}
	.intro-text {
		margin-top: var(--space-2);
		line-height: var(--leading-normal);
	}

</style>
