<script>
	// Optional link area for a work header — external links related to the
	// project (live site, PDF, article…). Driven by the work's `links` array.
	let { links = [] } = $props();

	const isExternal = (href) => /^https?:\/\//.test(href);
</script>

{#if links?.length}
	<nav class="work-links" aria-label="Project links">
		{#each links as link}
			<a
				href={link.href}
				class="link-underline"
				target={isExternal(link.href) ? '_blank' : undefined}
				rel={isExternal(link.href) ? 'noopener' : undefined}
			>
				{link.label}<span class="arrow" aria-hidden="true">↗</span>
			</a>
		{/each}
	</nav>
{/if}

<style>
	.work-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-3);
		margin-top: var(--space-3);
		font-size: var(--text-sm);
		color: var(--color-fg);
	}
	.arrow {
		margin-left: 0.15em;
		color: var(--color-fg);
	}
</style>
