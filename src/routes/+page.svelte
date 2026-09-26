<script>
	// The whole site: one page, one screen per viewport.
	//   home → project 01 … 05 → about
	// Screens are numbered the way the tracker is — home is -1 and has no
	// square, the projects are 0…n-1, about is n. See $lib/deck.svelte.js.
	import projects from '$lib/content/projects.json';
	import { site } from '$lib/content/site.js';
	import {
		deck,
		initGalleries,
		galleryStep,
		goToScreen,
		onDeckWheel,
		onDeckTouchStart,
		onDeckTouchEnd
	} from '$lib/deck.svelte.js';
	import DeckHeader from '$lib/components/DeckHeader.svelte';
	import HomeScreen from '$lib/components/HomeScreen.svelte';
	import ProjectScreen from '$lib/components/ProjectScreen.svelte';
	import AboutScreen from '$lib/components/AboutScreen.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';

	initGalleries(projects);

	const last = projects.length; // the about screen
	const trackerCount = projects.length + 1;

	// Every screen is stacked in the same place. The one on show is `on`; the
	// rest wait either above it or below it, so a switch always moves in the
	// direction you went — see .screen in app.css. Off-screen ones are inert
	// so Tab can't wander into content that isn't there.
	/** @param {number} i */
	const position = (i) => ({
		'data-pos': i === deck.index ? 'on' : i < deck.index ? 'above' : 'below',
		inert: i !== deck.index
	});

	// Nothing scrolls, so the keys are wired by hand.
	// Up/down move one screen; left/right page the gallery, matching the
	// chevrons either side of the phone.
	/** @param {KeyboardEvent} event */
	function onkeydown(event) {
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		switch (event.key) {
			case 'ArrowRight':
				galleryStep(1);
				break;
			case 'ArrowLeft':
				galleryStep(-1);
				break;
			case 'ArrowDown':
			case 'PageDown':
				event.preventDefault();
				goToScreen(deck.index + 1);
				break;
			case 'ArrowUp':
			case 'PageUp':
				event.preventDefault();
				goToScreen(deck.index - 1);
				break;
			case 'Home':
				event.preventDefault();
				goToScreen(-1);
				break;
			case 'End':
				event.preventDefault();
				goToScreen(last);
				break;
		}
	}
</script>

<svelte:window
	{onkeydown}
	onwheel={onDeckWheel}
	ontouchstart={onDeckTouchStart}
	ontouchend={onDeckTouchEnd}
/>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content="{site.name} — {site.statement}." />
</svelte:head>

<DeckHeader count={trackerCount} />
<Lightbox {projects} />

<div class="deck">
	<section class="screen" id="home" {...position(-1)}>
		<HomeScreen />
	</section>

	{#each projects as project, i (project.slug)}
		<section class="screen" id="work-{project.slug}" {...position(i)}>
			<ProjectScreen {project} index={i} />
		</section>
	{/each}

	<section class="screen" id="about" {...position(last)}>
		<AboutScreen />
	</section>
</div>
