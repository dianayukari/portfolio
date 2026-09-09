<script>
	// The column of covers beside the homepage index — two images per row, sitting
	// at the bottom of the column so the last row lines up with the last project.
	// `active` is owned by the page, so hovering here and hovering the list light
	// up the same work.
	import { base } from '$app/paths';

	let { works = [], active = null, onhover = () => {} } = $props();

	const resolve = (p) => (!p || /^https?:\/\//.test(p) ? p : base + p);
	const keyOf = (work) => work.slug ?? work.href;

	// Slots pair up two to a row, cycled if there are more works than slots.
	// `start`/`span` place each image on an 8-column grid (start + span must stay
	// <= 9) and `ar` sets the crop, so the split and the height change row to row
	// and no two images come out the same size.
	const SLOTS = [
		{ start: 1, span: 5, ar: '4 / 3' },
		{ start: 6, span: 3, ar: '3 / 4' },
		{ start: 1, span: 3, ar: '1 / 1' },
		{ start: 4, span: 5, ar: '16 / 10' },
		{ start: 1, span: 4, ar: '3 / 4' },
		{ start: 5, span: 4, ar: '4 / 3' }
	];
	const slot = (i) => SLOTS[i % SLOTS.length];

	const shown = $derived(works.filter((w) => w.cover));
</script>

<!-- Visual echo of the list: hidden from assistive tech and the tab order, since
     every image repeats a link that is already in the index. -->
<div
	class="gallery"
	class:hot={active !== null}
	aria-hidden="true"
	onpointerleave={() => onhover(null)}
>
	{#each shown as work, i (keyOf(work))}
		<a
			class="shot"
			class:on={active === keyOf(work)}
			href={work.href ?? `${base}/work/${work.slug}`}
			target={work.href ? '_blank' : undefined}
			rel={work.href ? 'noopener' : undefined}
			tabindex="-1"
			onpointerenter={() => onhover(keyOf(work))}
			style="--gc: {slot(i).start} / span {slot(i).span}; --ar: {slot(i).ar};"
		>
			<img src={resolve(work.cover)} alt="" loading="lazy" />
		</a>
	{/each}
</div>

<style>
	/* An 8-column grid carrying two images per row. `align-self: end` drops the
	   whole block to the foot of the column, so its last row finishes level with
	   the last project in the list; `align-items: start` lets each image keep its
	   own crop instead of stretching to match its row. */
	.gallery {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		align-items: start;
		align-self: end;
		gap: var(--space-1);
	}
	.shot {
		grid-column: var(--gc);
		aspect-ratio: var(--ar);
		display: block;
		background: var(--color-line);
		border-radius: var(--radius);
		overflow: hidden;
		transition:
			opacity var(--transition),
			filter var(--transition);
	}
	.shot img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	/* While any row is hovered, everything recedes except the match. */
	.gallery.hot .shot {
		opacity: 0.28;
		filter: saturate(0.4);
	}
	.gallery.hot .shot.on {
		opacity: 1;
		filter: none;
	}

	/* Stacked under the list — full width again, so let it breathe. */
	@media (max-width: 800px) {
		.gallery {
			align-self: auto;
			gap: var(--space-2);
		}
	}
</style>
