<script>
	// Name left, squares centre, statement right — all three vertically centred,
	// with the cue to scroll at the foot. Mobile stacks it: name at the top,
	// squares in the middle, statement and cue at the bottom.
	import { site } from '$lib/content/site.js';
	import { goToScreen } from '$lib/deck.svelte.js';
	import SquaresIntro from './SquaresIntro.svelte';
	import Chevron from './Chevron.svelte';
</script>

<div class="home">
	<div class="identity">
		<h1 class="display">{site.name}</h1>
		<p class="tagline">{site.tagline}</p>
	</div>

	<div class="art"><SquaresIntro /></div>

	<div class="statement"><p class="display">{site.statement}</p></div>

	<div class="cue">
		<button onclick={() => goToScreen(0)} aria-label="Go to the first project">
			<Chevron dir="down" size={30} />
		</button>
	</div>
</div>

<style>
	.home {
		display: grid;
		height: 100%;
		padding: var(--page-pad);
		/* Three columns of content, then the scroll cue on its own row. */
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr);
		grid-template-rows: 1fr auto;
		column-gap: 120px;
		align-items: center;
	}
	.identity {
		grid-area: 1 / 1;
	}
	.art {
		grid-area: 1 / 2;
		display: flex;
		justify-content: center;
	}
	.statement {
		grid-area: 1 / 3;
		display: flex;
		justify-content: flex-end;
	}
	.statement p {
		max-width: 265px;
	}
	.tagline {
		font-size: var(--text-body);
		line-height: var(--leading-body);
	}
	.cue {
		grid-area: 2 / 1 / 2 / 4;
		display: flex;
		justify-content: center;
	}

	/* Mobile is its own composition: a single column, name pinned top left,
	   statement and cue sitting together at the foot. */
	@media (max-width: 767px) {
		.home {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto 1fr auto auto;
			column-gap: 0;
			row-gap: var(--page-pad);
			align-items: start;
		}
		.identity {
			grid-area: 1 / 1;
		}
		.art {
			grid-area: 2 / 1;
			align-self: center;
			--squares-size: 237px;
		}
		.statement {
			grid-area: 3 / 1;
			justify-content: flex-start;
		}
		.statement p {
			max-width: 310px;
		}
		.cue {
			grid-area: 4 / 1;
			justify-content: flex-start;
			padding-left: 35px;
		}
	}
</style>
