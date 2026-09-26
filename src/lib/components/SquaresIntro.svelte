<script>
	// Nine equal squares that land as one solid 3×3 block. Only position
	// animates — they never change size.
	//
	// The scatter is seeded rather than truly random so the prerendered HTML and
	// the hydrated client agree on where every square starts. It reads as random
	// and, unlike Math.random(), never flashes into place on hydration.
	//
	// It plays again every time you come back to home: `visit` ticks each time
	// the deck arrives at -1, and the {#key} below remounts the squares, which
	// restarts their animation from the scatter.
	import { deck } from '$lib/deck.svelte.js';

	let visit = $state(0);
	let previous = deck.index;
	$effect(() => {
		const index = deck.index;
		if (index === -1 && previous !== -1) visit += 1;
		previous = index;
	});

	const COLS = 3;
	const SPREAD = 150; // % of one cell, so 1.5 cells in each direction

	/** @param {number} seed */
	function mulberry32(seed) {
		return () => {
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const random = mulberry32(20260922);
	const squares = Array.from({ length: COLS * COLS }, (_, i) => ({
		id: i,
		col: i % COLS,
		row: Math.floor(i / COLS),
		dx: (random() * 2 - 1) * SPREAD,
		dy: (random() * 2 - 1) * SPREAD,
		// Staggered out of reading order, so the block doesn't assemble in rows.
		delay: Math.round(random() * 420)
	}));
</script>

<div class="squares" aria-hidden="true">
	{#key visit}
		{#each squares as s (s.id)}
			<span
				class="sq"
				style="--col: {s.col}; --row: {s.row}; --dx: {s.dx}%; --dy: {s.dy}%; --d: {s.delay}ms"
			></span>
		{/each}
	{/key}
</div>

<style>
	.squares {
		position: relative;
		width: var(--squares-size, 300px);
		max-width: 100%;
		aspect-ratio: 1;
	}
	/* left/top place the square on its cell of the 3×3 and transform is left
	   free for the animation, so the two never have to be combined by hand.
	   The extra pixel of size overlaps each neighbour, which is what keeps the
	   settled block solid instead of showing nine antialiased seams. */
	.sq {
		position: absolute;
		left: calc(var(--col) * 100% / 3);
		top: calc(var(--row) * 100% / 3);
		width: calc(100% / 3 + 1px);
		height: calc(100% / 3 + 1px);
		background: var(--color-fg);
		animation: settle var(--settle) var(--d) both;
	}
	@keyframes settle {
		from {
			transform: translate(var(--dx), var(--dy));
		}
		to {
			transform: translate(0, 0);
		}
	}

	/* The global reduced-motion rule only shortens durations, which would still
	   hold the scatter for the length of the delay. Drop the animation outright. */
	@media (prefers-reduced-motion: reduce) {
		.sq {
			animation: none;
		}
	}
</style>
