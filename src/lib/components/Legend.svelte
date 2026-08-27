<script>
	// A map/chart legend — a color key mapping colors to values.
	// Standalone, or hosted inside <Figure> via its `legend` prop.
	//
	// Discrete bands:
	//   <Legend
	//     title="PGA (g)"
	//     items={[
	//       { color: '#f2d9c9', label: '0.10–0.25' },
	//       { color: '#e8896b', label: '0.25–0.55' },
	//       { color: '#b23b2e', label: '> 0.55' }
	//     ]}
	//   />
	//
	// Continuous gradient:
	//   <Legend
	//     variant="gradient"
	//     title="People / km²"
	//     stops={['#f7f6f3', '#6b675c', '#16150f']}
	//     ticks={['0', '1k', '25k+']}
	//   />
	let {
		variant = 'bands', // 'bands' | 'gradient' | 'bivariate'
		title = '',
		items = [], // bands: [{ color, label }]
		stops = [], // gradient: array of CSS colors
		ticks = [], // gradient/bivariate: tick labels, left→right
		rows = [], // bivariate: [{ label, colors: [...] }] — two aligned bars
		unit = '' // bivariate: axis label shown by the ticks (e.g. 'inhab/km²')
	} = $props();

	// Bivariate ticks sit at the left boundary of each segment (0, 1/N, …).
	const tickPct = (i) => (ticks.length ? (i / ticks.length) * 100 : 0);
</script>

<div class="legend" class:wide={variant === 'bivariate'}>
	{#if title}
		<div class="legend-title">{title}</div>
	{/if}

	{#if variant === 'bivariate'}
		<div class="biv">
			{#each rows as row}
				<span class="biv-rowlabel">{row.label}</span>
				<div class="biv-bar">
					{#each row.colors as c}
						<span class="biv-seg" style="background: {c};"></span>
					{/each}
				</div>
			{/each}
			<span class="biv-unit">{unit}</span>
			<div class="biv-ticks">
				{#each ticks as t, i}
					<span class="biv-tick" class:first={i === 0} style="left: {tickPct(i)}%;">{t}</span>
				{/each}
			</div>
		</div>
	{:else if variant === 'gradient'}
		<div class="bar" style="background: linear-gradient(to right, {stops.join(', ')});"></div>
		{#if ticks.length}
			<div class="ticks ticks--spread">
				{#each ticks as t}
					<span>{t}</span>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="bar bar--bands">
			{#each items as it}
				<span class="seg" style="background: {it.color};"></span>
			{/each}
		</div>
		<div class="ticks ticks--bands">
			{#each items as it}
				<span>{it.label}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.legend {
		display: inline-block;
		min-width: 9rem;
		max-width: 20rem;
		font-size: var(--text-xs);
		line-height: 1.3;
	}
	.legend.wide {
		display: block;
		width: 100%;
		min-width: 0;
		max-width: none;
	}
	.legend-title {
		margin-bottom: 0.35em;
		color: var(--color-fg);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		font-size: calc(var(--text-xs) - 1px);
	}

	.bar {
		display: flex;
		width: 100%;
		height: 0.6rem;
		border-radius: 1px;
		overflow: hidden;
	}
	.bar--bands .seg {
		flex: 1;
	}

	.ticks {
		display: flex;
		margin-top: 0.3em;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	/* Gradient: min…max at the ends. */
	.ticks--spread {
		justify-content: space-between;
	}
	/* Bands: one label centered under each segment. */
	.ticks--bands span {
		flex: 1;
		text-align: center;
	}

	/* -------- Bivariate: two aligned bars sharing one value axis -------- */
	.biv {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 0.3rem 0.6rem;
		min-width: 0;
		width: 100%;
		max-width: none;
	}
	.biv-rowlabel,
	.biv-unit {
		text-align: center;
		white-space: nowrap;
		font-size: var(--text-sm);
		color: var(--color-black);
	}
	.biv-unit {
		color: var(--color-muted);
	}
	.biv-bar {
		display: flex;
		width: 100%;
		height: 0.85rem;
	}
	.biv-seg {
		flex: 1;
		border-left: 1px dashed var(--color-muted);
	}
	.biv-seg:first-child {
		border-left: none;
	}
	.biv-ticks {
		position: relative;
		height: 1.1em;
		font-size: var(--text-xs);
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.biv-tick {
		position: absolute;
		top: 0;
		transform: translateX(-50%);
		white-space: nowrap;
	}
	.biv-tick.first {
		transform: translateX(0); /* keep the leading "0" from clipping */
	}

	/* Mobile: the row labels take too much width and the tick numbers collide.
	   Stack the labels above full-width bars and angle the ticks so long
	   numbers (50.000 / 100.000) never overlap. */
	@media (max-width: 560px) {
		.biv {
			display: flex;
			flex-direction: column;
			/* Override the desktop `align-items: center`: in a flex column that
			   shrinks every item to content width (centering text and collapsing
			   the ticks track to 0, stacking all the numbers). Stretch instead. */
			align-items: stretch;
		}
		.biv-rowlabel,
		.biv-unit {
			display: block;
			text-align: left;
			white-space: normal;
		}
		.biv-rowlabel {
			margin: 0.6em 0 0.25em;
		}
		.biv-rowlabel:first-child {
			margin-top: 0;
		}
		/* Numbers first, then the unit label. Horizontal + smaller so they fit
		   under full-width bars without rotating into them. */
		.biv-ticks {
			order: 1;
			height: 1.3em;
			margin-top: 0.35em;
			font-size: 0.75rem;
		}
		.biv-unit {
			order: 2;
			margin: 0.3em 0 0;
		}
	}
</style>
