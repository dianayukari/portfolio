<script>
	// Renders an ordered list of content blocks. Shared by the case-study and
	// blog layouts so both read from the same simple data schema.
	import MediaFigure from './MediaFigure.svelte';
	import Figure from './Figure.svelte';
	import Legend from './Legend.svelte';
	import { base } from '$app/paths';
	import { slugify } from '$lib/utils/slug.js';

	let { blocks = [] } = $props();

	const resolve = (p) => (!p || /^https?:\/\//.test(p) ? p : base + p);

	// Optional sizing/placement for a media block:
	//   width: CSS length ('60%', '18rem') — makes it smaller than the column
	//   align: 'left' | 'center' | 'right'  — placement (defaults to center)
	//   center: true — shorthand for natural size, centered
	function mediaClass(b) {
		const aligned = b.align || b.center || b.width;
		return [
			`b-media--${b.span ?? 'default'}`,
			aligned && !b.width && 'b-fit',
			b.align === 'left' && 'b-align-left',
			b.align === 'right' && 'b-align-right',
			aligned && b.align !== 'left' && b.align !== 'right' && 'b-align-center'
		]
			.filter(Boolean)
			.join(' ');
	}
	const mediaStyle = (b) => (b.width ? `width:${b.width};max-width:100%` : undefined);
</script>

{#each blocks as block}
	{#if block.type === 'heading'}
		<h2 class="b-heading" id={slugify(block.value)}><span>{block.value}</span></h2>
	{:else if block.type === 'text'}
		<p class="b-text">{block.value}</p>
	{:else if block.type === 'quote'}
		<blockquote class="b-quote">{block.value}</blockquote>
	{:else if block.type === 'list'}
		{#if block.ordered === false}
			<ul class="b-list">
				{#each block.items as item}<li>{@html item}</li>{/each}
			</ul>
		{:else}
			<ol class="b-list">
				{#each block.items as item}<li>{@html item}</li>{/each}
			</ol>
		{/if}
	{:else if block.type === 'figure'}
		<div class="b-media {mediaClass(block)}" style={mediaStyle(block)}>
			<Figure
				annotations={block.annotations}
				caption={block.caption}
				legend={block.legend}
				legendPosition={block.legendPosition ?? 'bottom-left'}
			>
				<img src={resolve(block.src)} alt={block.alt ?? ''} loading="lazy" />
			</Figure>
		</div>
	{:else if block.type === 'legend'}
		<div class="b-media b-media--default b-legend">
			<Legend {...block} />
		</div>
	{:else if block.type === 'image' || block.type === 'video'}
		<div class="b-media {mediaClass(block)}" style={mediaStyle(block)}>
			{#if block.type === 'image' && (block.annotations || block.legend)}
				<!-- Annotated/legended images render through Figure so their
				     overlays show; plain images use MediaFigure (video/zoom). -->
				<Figure
					annotations={block.annotations}
					caption={block.caption}
					legend={block.legend}
					legendPosition={block.legendPosition ?? 'bottom-left'}
				>
					<img src={resolve(block.src)} alt={block.alt ?? ''} loading="lazy" />
				</Figure>
			{:else}
				<MediaFigure {...block} />
			{/if}
		</div>
	{:else if block.type === 'columns'}
		<div class="b-columns">
			{#each block.items as item}
				{#if item.annotations || item.legend}
					<Figure
						annotations={item.annotations}
						caption={item.caption}
						legend={item.legend}
						legendPosition={item.legendPosition ?? 'bottom-left'}
					>
						<img src={resolve(item.src)} alt={item.alt ?? ''} loading="lazy" />
					</Figure>
				{:else}
					<MediaFigure {...item} />
				{/if}
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
	.b-heading,
	.b-list {
		max-width: var(--measure, var(--reading-max));
		margin-inline: auto;
	}
	.b-heading {
		font-size: var(--text-xl);
		margin-top: var(--space-3);
		margin-bottom: var(--space-2);
		color: var(--color-accent);
		scroll-margin-top: var(--space-4); /* offset for anchored TOC jumps */
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

	.b-list {
		margin-block: var(--space-2);
		padding-left: 1.5em;
		line-height: var(--leading-normal);
	}
	ol.b-list {
		list-style: decimal;
	}
	ul.b-list {
		list-style: disc;
	}
	.b-list li {
		margin-block: 0.4em;
		padding-left: 0.25em;
	}
	.b-list li::marker {
		color: var(--color-muted);
	}
	.b-list :global(a) {
		text-decoration: underline;
		text-underline-offset: 2px;
		text-decoration-color: var(--color-line);
	}
	.b-list :global(a:hover) {
		text-decoration-color: currentColor;
	}

	.b-media {
		margin-block: var(--space-3);
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
	/* Sizing/placement: `b-fit` shows the image at its natural size (never
	   upscaled); an explicit `width` (inline style) makes it smaller. The
	   `b-align-*` classes place the box left / center / right. */
	.b-fit {
		width: fit-content;
	}
	.b-align-left {
		margin-inline: 0 auto;
	}
	.b-align-center {
		margin-inline: auto;
	}
	.b-align-right {
		margin-inline: auto 0;
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
