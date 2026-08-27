<script>
	// Sticky table-of-contents with scroll-spy: highlights the section whose
	// heading is currently near the top of the viewport (benji.org style).
	import { onMount } from 'svelte';

	let { headings = [] } = $props();

	let active = $state(headings[0]?.id ?? null);

	onMount(() => {
		const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
		if (!els.length) return;

		// A heading becomes active when it crosses a thin band near the top
		// (between 15% and 20% down the viewport).
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) active = e.target.id;
				}
			},
			{ rootMargin: '-15% 0px -80% 0px', threshold: 0 }
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	});
</script>

<nav class="toc" aria-label="Sections">
	<ul>
		{#each headings as h}
			<li>
				<a
					href="#{h.id}"
					class="toc-link"
					class:active={active === h.id}
					aria-current={active === h.id ? 'true' : undefined}
				>
					{h.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.toc ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}
	.toc-link {
		display: block;
		font-size: var(--text-xs);
		line-height: 1.3;
		color: var(--color-muted);
		transition: color var(--transition);
	}
	.toc-link:hover {
		color: var(--color-fg);
	}
	.toc-link.active {
		color: var(--color-fg);
		font-weight: 600;
	}
</style>
