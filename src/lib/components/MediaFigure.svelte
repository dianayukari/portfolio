<script>
	import { base } from '$app/paths';

	let {
		type = 'image',
		src,
		caption = '',
		alt = '',
		poster,
		span = 'default',
		// Gallery passes this to enable click-to-zoom.
		onzoom
	} = $props();

	// Prefix local paths with the SvelteKit base; leave absolute URLs alone.
	const resolve = (p) => (!p || /^https?:\/\//.test(p) ? p : base + p);
	const url = $derived(resolve(src));
	const posterUrl = $derived(resolve(poster));
</script>

<figure class="figure figure--{span}">
	{#if type === 'video'}
		<video
			src={url}
			poster={posterUrl}
			controls
			muted
			loop
			playsinline
			preload="metadata"
		></video>
	{:else if onzoom}
		<button type="button" class="zoom" onclick={() => onzoom({ url, caption, alt })}>
			<img src={url} {alt} loading="lazy" />
		</button>
	{:else}
		<img src={url} {alt} loading="lazy" />
	{/if}
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	.figure {
		margin: 0;
	}
	.figure img,
	.figure video {
		width: 100%;
		border-radius: var(--radius);
	}
	.zoom {
		display: block;
		width: 100%;
		padding: 0;
		cursor: zoom-in;
	}
	.zoom img {
		transition: opacity var(--transition);
	}
	.zoom:hover img {
		opacity: 0.9;
	}
	figcaption {
		margin-top: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-muted);
	}
</style>
