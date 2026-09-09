<script>
	// Homepage index of works — a plain, understated text list. Hovering a title
	// reports it upward so the page can light up the matching cover in the
	// gallery beside it; the gallery reports back the same way.
	import { base } from '$app/paths';

	let { works = [], label = 'Projects', active = null, onhover = () => {} } = $props();

	const keyOf = (work) => work.slug ?? work.href;
</script>

<nav
	id="works"
	class="work-index"
	aria-label="Selected work"
	onpointerleave={() => onhover(null)}
>
	{#if label}
		<p class="index-label">{label}</p>
	{/if}
	<ul>
		{#each works as work (keyOf(work))}
			<li>
				<a
					class="row"
					class:on={active === keyOf(work)}
					href={work.href ?? `${base}/work/${work.slug}`}
					target={work.href ? '_blank' : undefined}
					rel={work.href ? 'noopener' : undefined}
					onpointerenter={() => onhover(keyOf(work))}
					onfocus={() => onhover(keyOf(work))}
					onblur={() => onhover(null)}
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
</nav>

<style>
	.work-index {
		margin-top: var(--space-3);
	}
	.index-label {
		font-size: var(--text-xs);
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
	/* Underlined on hover, and also when the matching cover is hovered. */
	.row:hover .row-title,
	.row:focus-visible .row-title,
	.row.on .row-title {
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
		font-size: var(--text-xs);
		font-variant-numeric: tabular-nums;
	}
</style>
