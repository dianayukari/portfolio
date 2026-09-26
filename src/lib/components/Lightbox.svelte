<script>
	// Desktop only: the active project's current slide, as big as the viewport
	// allows and without its frame — just the image or video itself. Opened by
	// clicking the media on a project screen; it reads the same gallery index
	// as the screen, so the chevrons and ← → keys page it in step.
	//
	// A native <dialog> opened with showModal() gives the top layer, the focus
	// trap and Esc for free. While it is open the deck ignores wheel, swipe and
	// ↑ ↓ (see deck.svelte.js and +page.svelte).
	import { base } from '$app/paths';
	import { deck, galleryStep, activeCount } from '$lib/deck.svelte.js';
	import Chevron from './Chevron.svelte';

	let { projects } = $props();

	/** @type {HTMLDialogElement | undefined} */
	let dialog = $state();

	const item = $derived(projects[deck.index]?.media?.[deck.gallery[deck.index] ?? 0]);
	const paging = $derived(activeCount() > 1);

	/** @param {string} [p] */
	const resolve = (p) => (!p || /^https?:\/\//.test(p) ? p : base + p);

	$effect(() => {
		if (!dialog) return;
		if (deck.lightbox && item && !dialog.open) dialog.showModal();
		else if (!(deck.lightbox && item) && dialog.open) dialog.close();
	});

	const close = () => (deck.lightbox = false);
</script>

<!-- Clicking anywhere that isn't a control closes it, the media included. -->
<dialog
	bind:this={dialog}
	class="lightbox"
	aria-label="Enlarged image"
	onclose={close}
	onclick={(event) => {
		if (!(event.target instanceof Element && event.target.closest('button'))) close();
	}}
>
	{#if deck.lightbox && item}
		{#key item.src}
			{#if item.type === 'video'}
				<video src={resolve(item.src)} poster={resolve(item.poster)} autoplay muted loop playsinline
				></video>
			{:else}
				<img src={resolve(item.src)} alt={item.alt ?? ''} />
			{/if}
		{/key}
	{/if}

	<button class="close" onclick={close} aria-label="Close">
		<span aria-hidden="true">×</span>
	</button>

	{#if paging}
		<button class="arrow prev" onclick={() => galleryStep(-1)} aria-label="Previous image">
			<Chevron dir="left" size={30} />
		</button>
		<button class="arrow next" onclick={() => galleryStep(1)} aria-label="Next image">
			<Chevron dir="right" size={30} />
		</button>
	{/if}
</dialog>

<style>
	.lightbox {
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: var(--page-pad);
		border: none;
		background: transparent;
		color: var(--color-fg);
		cursor: zoom-out;
	}
	.lightbox[open] {
		display: flex;
		align-items: center;
		justify-content: center;
		animation: lightbox-in var(--transition) both;
	}
	.lightbox::backdrop {
		background: var(--color-fg);
		opacity: 70%;
	}
	img,
	video {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
	.close {
		position: absolute;
		top: 24px;
		right: 32px;
		font-size: 40px;
		font-weight: var(--weight-light);
		line-height: 1;
	}
	.arrow {
		position: absolute;
		top: 50%;
		translate: 0 -50%;
		display: flex;
	}
	.prev {
		left: 24px;
	}
	.next {
		right: 24px;
	}
	.close,
	.arrow {
		cursor: pointer;
	}
	@keyframes lightbox-in {
		from {
			opacity: 0;
		}
	}
	/* Desktop only — on a phone the media already fills the screen. */
	@media (max-width: 767px) {
		.lightbox[open] {
			display: none;
		}
	}
</style>
