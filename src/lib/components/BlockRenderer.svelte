<script>
	// Renders an ordered list of content blocks. Shared by the case-study and
	// blog layouts so both read from the same simple data schema.
	import MediaFigure from './MediaFigure.svelte';

	let { blocks = [] } = $props();
</script>

{#each blocks as block}
	{#if block.type === 'heading'}
		<h2 class="b-heading">{block.value}</h2>
	{:else if block.type === 'text'}
		<p class="b-text">{block.value}</p>
	{:else if block.type === 'quote'}
		<blockquote class="b-quote">{block.value}</blockquote>
	{:else if block.type === 'image' || block.type === 'video'}
		<div class="b-media b-media--{block.span ?? 'default'}">
			<MediaFigure {...block} />
		</div>
	{:else if block.type === 'columns'}
		<div class="b-columns">
			{#each block.items as item}
				<MediaFigure {...item} />
			{/each}
		</div>
	{/if}
{/each}

<style>
	/* Text-level blocks stay within a comfortable reading measure and centered;
	   media can break out wider via span modifiers. Widths are driven by the
	   parent layout through the --measure custom property. */
	.b-text,
	.b-quote,
	.b-heading {
		max-width: var(--measure, var(--reading-max));
		margin-inline: auto;
	}
	.b-heading {
		font-size: var(--text-xl);
		margin-top: var(--space-5);
		margin-bottom: var(--space-2);
	}
	.b-text {
		margin-block: var(--space-2);
	}
	.b-text + .b-text {
		margin-top: var(--space-3);
	}
	.b-quote {
		font-size: var(--text-lg);
		line-height: var(--leading-snug);
		letter-spacing: var(--tracking-tight);
		border-left: 2px solid var(--color-fg);
		padding-left: var(--space-2);
		margin-block: var(--space-4);
	}

	.b-media {
		margin-block: var(--space-4);
	}
	/* 'default' media aligns with the text column; wider spans break out. */
	.b-media--default {
		max-width: var(--measure, var(--reading-max));
		margin-inline: auto;
	}
	.b-media--wide {
		max-width: 100%;
	}
	.b-media--full {
		/* full-bleed within the work container */
		max-width: 100%;
	}

	.b-columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2);
		margin-block: var(--space-4);
	}
	@media (max-width: 620px) {
		.b-columns {
			grid-template-columns: 1fr;
		}
	}
</style>
