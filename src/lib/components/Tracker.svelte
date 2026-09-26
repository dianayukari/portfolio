<script>
	// One square per screen that has one: every project, then about. Home has no
	// square, which is why the deck's index starts at -1. The active square is
	// simply bigger — nothing else about it changes. Each square is a button
	// that scrolls to its screen.
	import projects from '$lib/content/projects.json';
	import { deck, goToScreen } from '$lib/deck.svelte.js';

	let { count } = $props();

	/** @param {number} i */
	const label = (i) =>
		i < projects.length
			? `Project ${String(i + 1).padStart(2, '0')}: ${projects[i].title}`
			: 'About';
</script>

<nav class="tracker" aria-label="Screens">
	{#each Array.from({ length: count }, (_, i) => i) as i (i)}
		<button
			class="dot"
			class:on={deck.index === i}
			onclick={() => goToScreen(i)}
			aria-label={label(i)}
			aria-current={deck.index === i ? 'true' : undefined}
		></button>
	{/each}
</nav>

<style>
	.tracker {
		display: flex;
		align-items: center;
		gap: var(--dot-gap);
		height: var(--dot-active);
	}
	/* The header never takes pointer events, so the squares opt back in. */
	.dot {
		position: relative;
		flex: none;
		width: var(--dot);
		height: var(--dot);
		background: var(--color-fg);
		pointer-events: auto;
		transition:
			width var(--transition),
			height var(--transition);
	}
	/* A square is too small to hit reliably, so the target reaches out to fill
	   the gap on either side and the full height of the bar. */
	.dot::before {
		content: '';
		position: absolute;
		inset: calc((var(--dot) - var(--dot-active)) / 2 - 4px) calc(var(--dot-gap) / -2);
	}
	.dot.on {
		width: var(--dot-active);
		height: var(--dot-active);
	}
	.dot:focus-visible {
		outline: 2px solid var(--color-fg);
		outline-offset: 3px;
	}
</style>
