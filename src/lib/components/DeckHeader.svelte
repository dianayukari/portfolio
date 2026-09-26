<script>
	// Fixed over the deck. Home carries its own name in the middle of the screen,
	// so the header only exists from project 01 onward and fades in when you
	// leave home.
	//
	// Desktop: name, tagline, tracker — top left.
	// Mobile: just the tracker, centred. The gallery arrows live at the foot of
	// each project screen, beside the sheet toggle.
	import { site } from '$lib/content/site.js';
	import { deck } from '$lib/deck.svelte.js';
	import Tracker from './Tracker.svelte';

	let { count } = $props();

	const shown = $derived(deck.index >= 0);
</script>

<header class="deck-header" class:shown inert={!shown}>
	<div class="identity">
		<p class="display">{site.name}</p>
		<p class="tagline">{site.tagline}</p>
	</div>

	<div class="bar">
		<Tracker {count} />
	</div>
</header>

<style>
	/* Spans the page and carries its own margins, so anything added to it later
	   lines up with the columns underneath. Never takes pointer events itself —
	   a full-width bar would otherwise swallow clicks meant for the screen
	   below it — so its buttons opt back in individually. */
	.deck-header {
		position: fixed;
		z-index: 10;
		top: 0;
		left: 0;
		width: 100%;
		padding: var(--page-pad);
		opacity: 0;
		transition: opacity var(--transition);
		pointer-events: none;
	}
	.deck-header.shown {
		opacity: 1;
	}
	.tagline {
		font-size: var(--text-body);
		line-height: var(--leading-body);
	}
	/* 8px below the tagline, per the Figma header block. */
	.bar {
		display: flex;
		align-items: center;
		margin-top: 8px;
	}

	@media (max-width: 767px) {
		.deck-header {
			/* The bar sets its own inset instead — see .bar below. */
			padding: 0;
			height: var(--header-h);
			background: var(--color-bg);
		}
		.identity {
			display: none;
		}
		.bar {
			display: flex;
			height: 100%;
			margin-top: 0;
			justify-content: center;
		}
	}
</style>
