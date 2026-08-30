<script>
	// One route, three reusable layouts. The work's `type` decides which layout
	// renders it — add a work to the data and it just works, no new route needed.
	import CaseStudyLayout from '$lib/layouts/CaseStudyLayout.svelte';
	import GalleryLayout from '$lib/layouts/GalleryLayout.svelte';
	import BlogLayout from '$lib/layouts/BlogLayout.svelte';
	import { site } from '$lib/content/site.js';

	let { data } = $props();

	const LAYOUTS = {
		'case-study': CaseStudyLayout,
		gallery: GalleryLayout,
		blog: BlogLayout
	};
	const Layout = $derived(LAYOUTS[data.work.type] ?? CaseStudyLayout);
</script>

<svelte:head>
	<title>{site.name} — {data.work.title}</title>
	<meta name="description" content={data.work.summary} />
</svelte:head>

<Layout work={data.work} />
