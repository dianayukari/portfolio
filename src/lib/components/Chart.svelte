<script>
	// Host for an interactive D3 chart. Looks the draw function up in the chart
	// registry by `name`, runs it in the browser only (the site is prerendered,
	// so there's no DOM at build time), and re-runs it when the column resizes.
	import { onMount } from 'svelte';
	import { charts } from '$lib/charts/index.js';

	let {
		name,
		caption = '',
		// Height is derived from the measured width unless one is given outright.
		aspect = 16 / 9,
		height,
		// Anything else the draw function needs (data, thresholds, flags…).
		props: chartProps = {}
	} = $props();

	let el = $state(null);
	let teardown = null;
	let lastWidth = 0;
	// Bumped on every render so a slow module load from a superseded resize
	// can't draw over a newer one.
	let generation = 0;
	let alive = true;

	async function render(width) {
		const token = ++generation;

		teardown?.();
		teardown = null;
		// The canvas has no Svelte-managed children by design — D3 owns everything
		// inside it, and a redraw starts from an empty container.
		// eslint-disable-next-line svelte/no-dom-manipulating
		el.replaceChildren();

		const load = charts[name];
		if (!load) {
			console.warn(`[Chart] no chart registered as "${name}" — see src/lib/charts/index.js`);
			return;
		}

		const { default: drawChart } = await load();
		if (!alive || token !== generation) return;

		teardown =
			drawChart(el, {
				width,
				height: height ?? Math.round(width / aspect),
				...chartProps
			}) ?? null;
	}

	onMount(() => {
		// The observer fires once on observe, which doubles as the first draw.
		const ro = new ResizeObserver(([entry]) => {
			const width = Math.round(entry.contentRect.width);
			if (!width || width === lastWidth) return;
			lastWidth = width;
			render(width);
		});
		ro.observe(el);

		return () => {
			alive = false;
			ro.disconnect();
			teardown?.();
		};
	});
</script>

<figure class="chart">
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
	<div class="chart-canvas" bind:this={el}></div>
</figure>

<style>
	.chart {
		margin: 0;
	}
	.chart-canvas :global(svg) {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible; /* labels and hover states may sit outside the frame */
	}
	figcaption {
		margin-top: var(--space-1);
		margin-bottom: var(--space-1);
		font-size: var(--text-sm);
		font-weight: bold;
	}
</style>
