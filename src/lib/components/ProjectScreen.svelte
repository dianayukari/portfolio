<script>
	// One project, one screen. Both form factors live here and are switched by
	// the media query at the bottom rather than by matchMedia in JS: the page is
	// prerendered, and a JS swap would paint the wrong layout first.
	//
	// Desktop: text · media · fields, chevrons flanking the media.
	// Mobile: the media fills the screen, and the text lives in a sheet that
	// slides up over it.
	//
	// Nothing draws a device around the media — any frame is part of the image
	// itself, so a slide is shown whole (contain) rather than cropped to a slot.
	import { deck, galleryStep } from '$lib/deck.svelte.js';
	import Gallery from './Gallery.svelte';
	import Chevron from './Chevron.svelte';

	let { project, index } = $props();

	const number = $derived(String(index + 1).padStart(2, '0'));
	const slide = $derived(deck.gallery[index] ?? 0);
	const media = $derived(project.media ?? []);
	const paging = $derived(media.length > 1);
	const eyebrow = $derived((project.disciplines ?? []).join(' · '));

	// One shape for every field, so the column renders in a single loop and a
	// field with nothing in it is skipped, label and all.
	/** @type {{ label: string, text: string, items: string[] }[]} */
	const fields = $derived([
		{ label: 'Description', text: project.description ?? '', items: [] },
		{ label: 'Role', text: '', items: project.role ?? [] },
		{ label: 'Solution', text: project.solution ?? '', items: [] },
		{ label: 'Focus', text: '', items: project.focus ?? [] }
	]);

	// Closes itself whenever this screen stops being the one on show, so
	// scrolling back to a project never lands on an open sheet.
	let sheetOpen = $state(false);
	$effect(() => {
		if (deck.index !== index) sheetOpen = false;
	});
</script>

<!-- ————————————————————————————————————————————————————————— desktop -->
<div class="view desktop">
	<div class="meta">
		<p class="display">({number})</p>
		{#if project.title}<h2 class="display">{project.title}</h2>{/if}
		{#if project.subtitle}<p class="subtitle">{project.subtitle}</p>{/if}
	</div>

	<div class="stage">
		<button
			class="arrow"
			class:idle={!paging}
			onclick={() => galleryStep(-1)}
			aria-label="Previous image"
			tabindex={paging ? 0 : -1}
		>
			<Chevron dir="left" size={26} />
		</button>

		<button
			class="media-slot"
			onclick={() => (deck.lightbox = true)}
			aria-label="Enlarge image"
			disabled={!media.length}
		>
			<Gallery {media} index={slide} />
		</button>

		<button
			class="arrow"
			class:idle={!paging}
			onclick={() => galleryStep(1)}
			aria-label="Next image"
			tabindex={paging ? 0 : -1}
		>
			<Chevron dir="right" size={26} />
		</button>
	</div>

	<div class="fields">
		<div class="field-stack">
			{#each fields as field (field.label)}
				{#if field.text || field.items.length}
					<div class="field">
						<p class="label">{field.label}</p>
						{#if field.text}<p>{field.text}</p>{/if}
						{#if field.items.length}
							<ul>
								{#each field.items as item (item)}<li>{item}</li>{/each}
							</ul>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
		{#if project.liveUrl}
			<a class="label live" href={project.liveUrl} target="_blank" rel="noopener">See live ↗</a>
		{/if}
	</div>
</div>

<!-- —————————————————————————————————————————————————————————— mobile -->
<div class="view mobile">
	<div class="card">
		{#if project.liveUrl}
			<a
				href={project.liveUrl}
				target="_blank"
				rel="noopener"
				aria-label="Open {project.title || 'the project'}"
			>
				<Gallery {media} index={slide} />
			</a>
		{:else}
			<Gallery {media} index={slide} />
		{/if}
	</div>

	<div class="sheet" class:open={sheetOpen} inert={!sheetOpen}>
		{#if eyebrow}<p class="label">{eyebrow}</p>{/if}
		{#if project.title}<h2 class="display">{project.title}</h2>{/if}
		{#if project.subtitle}<p class="subtitle">{project.subtitle}</p>{/if}
		{#if project.solution}<p class="sheet-text">{project.solution}</p>{/if}
	</div>

	<!-- ‹ ⌃ › — the gallery arrows flank the sheet toggle on one line. They
	     step aside while the sheet is open, since the media is covered. -->
	<div class="controls">
		<button
			class="arrow"
			class:idle={!paging || sheetOpen}
			onclick={() => galleryStep(-1)}
			aria-label="Previous image"
			tabindex={paging && !sheetOpen ? 0 : -1}
		>
			<Chevron dir="left" size={26} />
		</button>

		<button
			class="sheet-toggle"
			onclick={() => (sheetOpen = !sheetOpen)}
			aria-expanded={sheetOpen}
			aria-label={sheetOpen ? 'Hide project details' : 'Show project details'}
		>
			<Chevron dir={sheetOpen ? 'down' : 'up'} size={34} ring />
		</button>

		<button
			class="arrow"
			class:idle={!paging || sheetOpen}
			onclick={() => galleryStep(1)}
			aria-label="Next image"
			tabindex={paging && !sheetOpen ? 0 : -1}
		>
			<Chevron dir="right" size={26} />
		</button>
	</div>
</div>

<style>
	.view {
		height: 100%;
	}
	.mobile {
		display: none;
	}

	/* ——————————————————————————————————————————————————————— desktop */
	/* padding-top fences off the header, leaving a band of page minus header.
	   The single row fills --screen-fill of that band and align-content centres
	   it there, so the columns sit on the middle of the space they actually have
	   rather than hanging off the bottom of the header. */
	.desktop {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr);
		grid-template-rows: var(--screen-fill);
		column-gap: 80px;
		align-content: center;
		align-items: stretch;
		padding: var(--header-h) var(--page-pad) 0;
	}
	.meta {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 10px;
	}
	/* Items stretch so the media slot is simply the full height of the content
	   row — no percentage to resolve against a flex container, which is what
	   went wrong when the slot tried to size itself. The arrows re-centre
	   themselves inside that full height. */
	.stage {
		display: flex;
		align-items: stretch;
		justify-content: space-between;
		gap: 16px;
	}
	/* A fixed slot between the chevrons: each slide is contained inside it, so
	   the layout stays put whatever shape the next image is. */
	/* A fixed slot between the chevrons: every slide is sized inside it, so the
	   layout stays put whatever shape the next image is. */
	.media-slot {
		flex: 1;
		min-width: 0;
		cursor: zoom-in;
	}
	.arrow {
		flex: none;
		align-self: center;
		display: flex;
		align-items: center;
	}
	.arrow.idle {
		visibility: hidden;
	}
	.fields {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 50px;
	}
	.field-stack {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.field ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.live {
		align-self: flex-start;
	}

	/* ———————————————————————————————————————————————————————— mobile */
	@media (max-width: 767px) {
		.desktop {
			display: none;
		}
		.mobile {
			display: block;
			position: relative;
		}
		/* The media is the screen: full bleed under the header, stopping just
		   short of the toggle. */
		.card {
			position: absolute;
			top: var(--header-h);
			right: 10px;
			bottom: 69px;
			left: 10px;
			border-radius: 12px;
			overflow: hidden;
			/* A long press on the media is almost always a thumb resting while
			   swiping, so iOS's link/image menu and the dim highlight that
			   precedes it are switched off. A tap still opens the live link. */
			-webkit-touch-callout: none;
			-webkit-tap-highlight-color: transparent;
			-webkit-user-select: none;
			user-select: none;
		}
		.card :global(img),
		.card :global(video) {
			pointer-events: none;
		}
		.card a {
			display: block;
			height: 100%;
		}
		.sheet {
			position: absolute;
			z-index: 2;
			right: 0;
			bottom: 0;
			left: 0;
			display: flex;
			flex-direction: column;
			gap: 6px;
			/* 265 is the Figma height; the sheet grows past it for a project with
			   longer copy rather than spilling out over the media. */
			min-height: 265px;
			max-height: 62%;
			overflow-y: auto;
			overscroll-behavior: contain;
			padding: 26px 20px 80px;
			background: var(--color-bg);
			translate: 0 100%;
			transition: translate var(--transition);
		}
		.sheet.open {
			translate: 0 0;
		}
		.sheet .display {
			margin-top: 12px;
		}
		.sheet-text {
			margin-top: 12px;
		}
		.sheet .label {
			font-weight: var(--weight-light);
		}
		/* The same 58px inset the arrows had in the header bar, so they only
		   move down, not sideways. */
		.controls {
			position: absolute;
			z-index: 3;
			right: 0;
			bottom: 17px;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-inline: 58px;
		}
		.sheet-toggle {
			display: flex;
		}
	}
</style>
