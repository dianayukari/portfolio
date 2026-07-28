<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="site">
	<SiteHeader />
	<main>
		{@render children()}
	</main>
	<SiteFooter />
</div>

<style>
	.site {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	main {
		flex: 1 0 auto;
	}
</style>
