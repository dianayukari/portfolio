<script>
	// The one chevron in the design, rotated to taste. `ring` draws the circle
	// around it that the mobile sheet toggle uses.
	let { dir = 'down', size = 26, ring = false } = $props();

	/** @type {Record<string, number>} */
	const ROTATION = { right: 0, down: 90, left: 180, up: 270 };
</script>

<span class="chev" class:ring style="--rot: {ROTATION[dir]}deg; --size: {size}px">
	<svg viewBox="0 0 24 24" aria-hidden="true">
		<polyline
			points="9 4 17 12 9 20"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</span>

<style>
	.chev {
		display: inline-flex;
		box-sizing: border-box;
		width: var(--size);
		height: var(--size);
		color: inherit;
	}
	.chev svg {
		width: 100%;
		height: 100%;
		rotate: var(--rot);
	}
	.ring {
		padding: calc(var(--size) * 0.22);
		border: 1.5px solid currentColor;
		border-radius: 50%;
	}
</style>
