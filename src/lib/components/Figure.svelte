<script>
	// Annotated figure: a base image (passed as the default slot) overlaid with
	// text annotations positioned as percentages of the image box, so they stay
	// put as the image scales.
	//
	// Usage in markup:
	//   <Figure
	//     caption="Final map"
	//     annotations={[
	//       { x: 22, y: 40, text: 'Plate boundary' },      // with a dot marker
	//       { x: 68, y: 55, text: 'Dense settlement', dot: false } // text only
	//     ]}
	//   >
	//     <img src="/works/earthquake/01.png" alt="World hazard map" />
	//   </Figure>
	//
	// x / y are 0–100 (percent of the image, from the top-left).
	// Per-annotation options:
	//   dot: false         hide the marker (text-only)
	//   background: false  no highlight panel, just text
	//   bold: true         heavier weight
	//
	// Optional overlaid legend (see Legend.svelte for the data shape):
	//   <Figure legend={{ variant: 'bands', title: 'PGA (g)', items: [...] }}
	//           legendPosition="bottom-left"> … </Figure>
	// legendPosition: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
	import Legend from './Legend.svelte';

	let {
		annotations = [],
		caption = '',
		legend = null,
		legendPosition = 'bottom-left',
		children
	} = $props();
</script>

<figure class="figure">
	<div class="stage">
		{@render children?.()}
		{#each annotations as a}
			<span class="annotation" style="left: {a.x}%; top: {a.y}%;">
				{#if a.dot !== false}
					<span class="dot" aria-hidden="true"></span>
				{/if}
				<span class="label" class:plain={a.background === false} class:bold={a.bold}>
					{a.text}
				</span>
			</span>
		{/each}
		{#if legend}
			<div class="legend-overlay legend-overlay--{legendPosition}">
				<Legend {...legend} />
			</div>
		{/if}
	</div>
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	.figure {
		margin: 0;
	}
	.stage {
		position: relative;
		display: block;
		line-height: 0; /* collapse whitespace under the image */
	}
	/* The base image is slotted from the parent, so it carries the parent's
	   scope — reach it with :global. */
	.stage :global(img),
	.stage :global(video) {
		display: block;
		width: 100%;
		height: auto;
		border-radius: var(--radius);
	}

	.annotation {
		position: absolute;
		transform: translate(-50%, -50%);
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		max-width: 12rem;
		line-height: 1.3;
	}
	.dot {
		flex: none;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--color-fg);
		box-shadow: 0 0 0 3px var(--color-highlight);
	}
	.label {
		padding: 0.1em 0.4em;
		font-size: var(--text-xs);
		color: var(--color-black);
		background: var(--color-highlight);
		border-radius: var(--radius);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
	}
	/* background: false → no highlight panel, just text. */
	.label.plain {
		padding: 0;
		background: none;
		box-shadow: none;
	}
	/* bold: true → heavier weight. */
	.label.bold {
		font-weight: 600;
	}

	/* Legend overlaid on the image, on a subtle backdrop for legibility. */
	.legend-overlay {
		position: absolute;
		max-width: 70%;
		padding: 0.5rem 0.6rem;
		background: color-mix(in srgb, var(--color-bg) 84%, transparent);
		-webkit-backdrop-filter: blur(3px);
		backdrop-filter: blur(3px);
		border-radius: var(--radius);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
		line-height: normal;
	}
	.legend-overlay--bottom-left {
		left: 0.6rem;
		bottom: 0.6rem;
	}
	.legend-overlay--bottom-right {
		right: 0.6rem;
		bottom: 0.6rem;
	}
	.legend-overlay--top-left {
		left: 0.6rem;
		top: 0.6rem;
	}
	.legend-overlay--top-right {
		right: 0.6rem;
		top: 0.6rem;
	}

	figcaption {
		margin-top: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-muted);
		line-height: var(--leading-normal);
	}
</style>
