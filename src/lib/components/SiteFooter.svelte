<script>
	import { site } from '$lib/content/site.js';
</script>

<footer class="site-footer frame">
	<nav class="footer-links">
		{#each site.links as link}
			<a href={link.href} class="link-underline" rel="me noopener">{link.label}</a>
		{/each}
	</nav>
	<p class="footer-note">{site.footer}</p>
</footer>

<style>
	.site-footer {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-4);
		align-items: baseline;
		justify-content: space-between;
		margin-top: var(--space-7);
		padding-top: var(--space-3);
		padding-bottom: var(--space-4);
		border-top: 1px solid var(--color-line);
		font-size: var(--text-sm);
		color: var(--color-muted);
	}
	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}
</style>
