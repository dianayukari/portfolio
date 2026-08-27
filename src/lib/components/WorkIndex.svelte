<script>
	// Homepage index of works — a plain, understated text list in the centered
	// column (benji.org style). Hovering a title reveals a small thumbnail that
	// follows the cursor. Hidden on touch / small screens.
	import { base } from '$app/paths';

	let { works = [], label = 'Projects' } = $props();

	let active = $state(null); // slug of the hovered work, or null
	let x = $state(0);
	let y = $state(0);
	let flip = $state(false); // flip to the left of the cursor near the right edge

	const resolve = (p) => (!p || /^https?:\/\//.test(p) ? p : base + p);

	function move(e) {
		x = e.clientX;
		y = e.clientY;
		flip = x > window.innerWidth - 260;
	}
</script>

<nav
	id="works"
	class="work-index frame"
	aria-label="Selected work"
	onpointermove={move}
	onpointerleave={() => (active = null)}
>
	{#if label}
		<p class="index-label">{label}</p>
	{/if}
	<ul>
		{#each works as work (work.slug ?? work.href)}
			<li>
				<a
					class="row"
					href={work.href ?? `${base}/work/${work.slug}`}
					target={work.href ? '_blank' : undefined}
					rel={work.href ? 'noopener' : undefined}
					onpointerenter={() => (active = work.slug ?? work.href)}
					onfocus={() => (active = work.slug ?? work.href)}
					onblur={() => (active = null)}
				>
					<span class="row-main">
						<span class="row-title">{work.title}</span>
						{#if work.status}
							<span class="row-status">{work.status}</span>
						{/if}
						{#if work.href}
							<span class="row-ext" aria-hidden="true">↗</span>
						{/if}
					</span>
					<span class="row-year">{work.year}</span>
				</a>
			</li>
		{/each}
	</ul>

	<!-- Cursor-following thumbnail. All covers are rendered once (so they're
	     preloaded) and toggled by opacity for an instant, flicker-free reveal. -->
	<div class="thumb" aria-hidden="true" style="transform: translate({x}px, {y}px)">
		{#each works as work (work.slug ?? work.href)}
			<img
				src={resolve(work.cover)}
				alt=""
				loading="eager"
				class:visible={active === (work.slug ?? work.href)}
				class:flip
			/>
		{/each}
	</div>
</nav>

<style>
	.work-index {
		margin-top: var(--space-5);
	}
	.index-label {
		font-size: var(--text-sm);
		color: var(--color-muted);
		margin-bottom: var(--space-1);
	}
	ul {
		list-style: none;
		padding: 0;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 5.5rem;
		align-items: baseline;
		column-gap: var(--space-3);
		padding-block: 0.35rem;
	}
	/* Title + status grouped on the left, status hugging the title. */
	.row-main {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		min-width: 0;
	}
	.row-title {
		text-decoration: underline;
		text-decoration-color: transparent;
		text-underline-offset: 3px;
		transition: text-decoration-color var(--transition);
	}
	.row:hover .row-title,
	.row:focus-visible .row-title {
		text-decoration-color: currentColor;
	}
	.row-status {
		flex: none;
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		color: var(--color-accent);
	}
	.row-ext {
		flex: none;
		font-size: var(--text-sm);
		color: var(--color-muted);
	}
	.row-year {
		text-align: right;
		white-space: nowrap;
		color: var(--color-muted);
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
	}

	/* Thumbnail: container is pinned to the cursor; each image offsets itself. */
	.thumb {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 20;
		pointer-events: none;
		will-change: transform;
	}
	.thumb img {
		position: absolute;
		width: 13rem;
		/* The global `img { max-width: 100% }` reset would resolve to 0 here,
		   because the fixed container has no width — opt out of it. */
		max-width: none;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: var(--radius);
		background: var(--color-line);
		opacity: 0;
		translate: 24px -50%;
		transition: opacity 150ms ease;
	}
	.thumb img.flip {
		translate: calc(-100% - 24px) -50%;
	}
	.thumb img.visible {
		opacity: 1;
	}

	@media (max-width: 700px), (hover: none) {
		.thumb {
			display: none;
		}
	}
</style>
