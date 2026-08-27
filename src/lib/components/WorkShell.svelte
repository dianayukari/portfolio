<script>
	// Shared frame for every work page: a sticky left rail (back-to-index + the
	// scroll-spy TOC) beside a main content column (passed as children). The
	// work's own header/meta stays in the main column. Collapses to a single
	// column on narrow screens, where the rail sits on top and the TOC hides.
	import WorkToc from './WorkToc.svelte';
	import { base } from '$app/paths';

	let {
		headings = [], // [{ id, label }] — first entry is usually the work title
		mainWidth = 'var(--col-text)',
		children
	} = $props();
</script>

<article class="work" style="--work-main:{mainWidth}">
	<div class="work-shell">
		<aside class="work-rail">
			<a class="work-back link-underline" href="{base}/#works">← Index</a>
			{#if headings.length}
				<div class="work-toc">
					<WorkToc {headings} />
				</div>
			{/if}
		</aside>

		<div class="work-col">
			{@render children?.()}
		</div>
	</div>
</article>

<style>
	/* The main column is centered on the page (so it lines up with the footer);
	   the rail sits in the left margin next to it. Three tracks: flexible left
	   margin, the centered content, flexible right margin. */
	.work-shell {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, var(--work-main, var(--col-text))) minmax(0, 1fr);
		padding-inline: var(--page-pad);
		margin-top: var(--space-4);
	}
	.work-rail {
		grid-column: 1;
		justify-self: end; /* sit against the content */
		/* Cap to the side track so a narrow margin (wide gallery column) can't
		   push the rail off-screen to the left. */
		width: 100%;
		max-width: var(--rail-w, 13rem);
		padding-right: var(--space-4);
		position: sticky;
		top: var(--space-4);
		align-self: start;
	}
	.work-back {
		display: inline-block; /* box hugs the text so the underline ends at the word */
		font-size: var(--text-sm);
		color: var(--color-muted);
	}
	.work-toc {
		margin-top: var(--space-3);
	}
	.work-col {
		grid-column: 2;
		min-width: 0;
	}

	/* Not enough side margin for the rail → collapse to a single centered column
	   (rail on top, TOC hidden). */
	@media (max-width: 1160px) {
		.work-shell {
			display: block;
			max-width: var(--work-main, var(--col-text));
			margin-inline: auto;
		}
		.work-rail {
			position: static;
			width: auto;
			margin: 0 0 var(--space-3);
		}
		.work-toc {
			display: none;
		}
	}
</style>
