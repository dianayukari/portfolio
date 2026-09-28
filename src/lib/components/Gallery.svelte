<script>
	// The media a project's chevrons page through. Every slide stays mounted so
	// stepping is instant and the crossfade has something to fade to; videos are
	// the exception — a video is only a real <video> once it has been shown (the
	// rest sit as their poster), and only the active one plays, so five files
	// never run at once. A shown video stays mounted, paused: pulling it out the
	// moment it stops being active left its bezel empty mid-fade, collapsed to a
	// thin frame.
	//
	// A slide can carry a frame:
	//   "phone"  — a dark bezel, filled edge to edge
	//   "window" — a minimal macOS-style title bar sitting on top of the image
	// Anything else sits bare on the page ground and is shown whole (contain).
	// Both are desktop-only. On mobile the screen is already the frame, so every
	// slide falls back to the bare treatment.
	import { base } from '$app/paths';

	let { media = [], index = 0, alt = '' } = $props();

	/** @param {string} [p] */
	const resolve = (p) => (!p || /^https?:\/\//.test(p) ? p : base + p);

	// A frame has no size of its own until its media does — before the image
	// loads, the bezel's padding and background show as a thin empty sliver. So
	// each holder stays hidden until something inside it has loaded.
	/** @type {Record<string, boolean>} */
	let loaded = $state({});

	/** @param {HTMLImageElement | HTMLVideoElement} node @param {string} key */
	function ready(node, key) {
		const mark = () => (loaded[key] = true);
		if (
			node instanceof HTMLImageElement ? node.complete && node.naturalWidth : node.readyState >= 2
		)
			mark();
		const ev = node instanceof HTMLImageElement ? 'load' : 'loadeddata';
		node.addEventListener(ev, mark);
		return { destroy: () => node.removeEventListener(ev, mark) };
	}

	/** @type {Record<string, boolean>} */
	let shown = $state({});
	$effect(() => {
		const item = media[index];
		if (item?.type === 'video') shown[item.src] = true;
	});

	/** @param {HTMLVideoElement} node @param {boolean} active */
	function playing(node, active) {
		const set = (/** @type {boolean} */ on) => (on ? node.play().catch(() => {}) : node.pause());
		set(active);
		return { update: set };
	}
</script>

<div class="gallery">
	{#each media as item, i (item.src)}
		<div class="slide" class:on={i === index}>
			<div
				class="holder"
				class:phone={item.frame === 'phone'}
				class:window={item.frame === 'window'}
				class:ready={loaded[item.src]}
			>
				{#if item.frame === 'window'}<span class="bar" aria-hidden="true"></span>{/if}
				{#if item.type === 'video'}
					{#if i === index || shown[item.src]}
						<video
							src={resolve(item.src)}
							poster={resolve(item.poster)}
							muted
							loop
							playsinline
							use:ready={item.src}
							use:playing={i === index}
						></video>
					{:else if item.poster}
						<img
							src={resolve(item.poster)}
							alt={item.alt ?? alt}
							loading="lazy"
							use:ready={item.src}
						/>
					{/if}
				{:else}
					<img
						src={resolve(item.src)}
						alt={item.alt ?? alt}
						loading={i === 0 ? 'eager' : 'lazy'}
						use:ready={item.src}
					/>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.gallery {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.slide {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity var(--transition);
	}
	.slide.on {
		opacity: 1;
	}
	.holder {
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity var(--transition);
	}
	.holder.ready {
		opacity: 1;
	}
	.holder :global(img),
	.holder :global(video) {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	/* The bezel. Width comes from the aspect ratio, so the frame is as tall as
	   the slot and centred in it. The media's 100%/100% resolves against the
	   content box, which the padding has already inset — that padding is the
	   bezel you see. */
	.holder.phone {
		position: relative;
		flex: none;
		width: auto;
		height: var(--phone-height);
		max-height: 1080px;
		/* aspect-ratio: 0.48; */
		padding: 10px;
		border-radius: 44px;
		background: var(--color-fg);
	}
	.holder.phone :global(img),
	.holder.phone :global(video) {
		border-radius: 34px;
		object-fit: fill;
	}

	/* The window sizes from its width — a desktop screenshot is wide, so width is
	   what runs out first — and shrink-wraps in height: the image's own ratio
	   gives its height, the bar adds its own, and the slide centres the result in
	   the slot. That is what keeps the bar exactly as wide as the image. */
	.holder.window {
		flex: none;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
		max-height: 100%;
		border-radius: 10px;
		overflow: hidden;
		background: var(--color-fg);
	}
	.bar {
		display: flex;
		flex: none;
		align-items: center;
		height: var(--window-bar);
		padding-inline: 12px;
	}
	/* Three dots, one element: the box-shadow copies stand in for the other two. */
	.bar::before {
		content: '';
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-bg);
		box-shadow:
			14px 0 0 var(--color-bg),
			28px 0 0 var(--color-bg);
	}
	/* No forced ratio: the image keeps its own, the holder wraps whatever height
	   that comes to, and nothing is ever cropped. `contain` is only a backstop
	   for an image tall enough to overflow the slot — it letterboxes instead of
	   trimming. */
	.holder.window :global(img),
	.holder.window :global(video) {
		flex: 0 1 auto;
		min-height: 0;
		width: 100%;
		height: auto;
		object-fit: contain;
	}

	/* No frames on mobile at all — the screen is the frame. Every slide falls
	   back to the bare treatment: full bleed, shown whole. */
	@media (max-width: 767px) {
		.bar {
			display: none;
		}
		.holder.phone,
		.holder.window {
			width: 100%;
			height: 100%;
			aspect-ratio: auto;
			padding: 0;
			border-radius: 0;
			background: none;
		}
		.holder.phone :global(img),
		.holder.phone :global(video),
		.holder.window :global(img),
		.holder.window :global(video) {
			width: 100%;
			height: 100%;
			aspect-ratio: auto;
			border-radius: 0;
			object-fit: contain;
		}
	}
</style>
