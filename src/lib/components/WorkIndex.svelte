<script>
	// Homepage index of works — a plain, understated text list in the centered
	// column (benji.org style). Hierarchy by weight/colour, not size.
	import { base } from '$app/paths';

	let { works = [] } = $props();
</script>

<nav id="works" class="work-index frame" aria-label="Selected work">
	<ul>
		{#each works as work}
			<li>
				<a class="row" href="{base}/work/{work.slug}">
					<span class="row-title">{work.title}</span>
					<span class="row-year">{work.year}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.work-index {
		margin-top: var(--space-5);
	}
	ul {
		list-style: none;
		padding: 0;
	}
	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block: 0.35rem;
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
	.row-year {
		flex: none;
		color: var(--color-muted);
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
	}
</style>
