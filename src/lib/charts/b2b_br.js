// -----------------------------------------------------------------------------
// CHART · b2b_br
// Small multiples: one horizontal bar chart per merchant vertical, showing
// EBANX merchants' payment mix against the market average.
//
// Everything is scoped to `draw` — nothing runs at import time, because this
// module is also imported during prerender, where there is no DOM.
// -----------------------------------------------------------------------------
import * as d3 from 'd3';
import { base } from '$app/paths';
import { createTooltip } from './_tooltip.js';

const COLORS = {
	purple100: '#9C50FF',
	chartLight: '#E0E0E0',
	chartMedium: '#808080',
	darkOrange: '#BA5E00',
	lightNeonGreen: '#F6FAE6'
};

const CONFIG = {
	margin: { top: 10, right: 20, bottom: 26, left: 110 },
	titleHeight: 24,
	rowHeight: 26,
	barPadding: 0.15,
	marketDot: { radius: 5, strokeWidth: 1 },
	twoColumnBreakpoint: 720,
	mobileBreakpoint: 480,
	columnGap: 24
};

const cache = new Map();

function loadData(url) {
	if (!cache.has(url)) {
		cache.set(
			url,
			d3.csv(url, (d) => ({
				vertical: d.merchant_vertical_commercial,
				method: d.metodo_de_pagamento_ajustado,
				value: +d.value * 100,
				type: d.type
			}))
		);
	}
	return cache.get(url);
}

export default function draw(el, { width, src }) {
	if (!src) {
		console.warn("[b2b_br] no `src` — pass the CSV path in the block's `props`");
		return;
	}

	const url = /^https?:\/\//.test(src) ? src : base + src;

	let cancelled = false;
	const isMobile = width < CONFIG.mobileBreakpoint;

	const wrapper = d3.select(el).append('div').style('position', 'relative');
	const legend = wrapper
		.append('div')
		.style('display', 'flex')
		.style('flex-wrap', 'wrap')
		.style('gap', 'var(--space-2)')
		.style('margin-bottom', 'var(--space-2)');

	// Small multiples go two-up once there's room for it.
	const columns = width >= CONFIG.twoColumnBreakpoint ? 2 : 1;
	const chartWidth = Math.floor((width - CONFIG.columnGap * (columns - 1)) / columns);

	const grid = wrapper
		.append('div')
		.style('display', 'grid')
		.style('grid-template-columns', `repeat(${columns}, minmax(0, 1fr))`)
		.style('gap', `var(--space-3) ${CONFIG.columnGap}px`);

	const tooltip = createTooltip(wrapper);

	const margin = {
		...CONFIG.margin,
		left: Math.min(CONFIG.margin.left, Math.round(chartWidth * 0.34))
	};
	const boundedWidth = chartWidth - margin.left - margin.right;

	loadData(url)
		.then((loaded) => {
			if (cancelled) return;
			initCharts(loaded);
		})
		.catch((err) => {
			if (cancelled) return;
			console.error('[b2b_br] could not load', url, err);
			grid.append('p').style('color', COLORS.chartMedium).text(`Could not load ${src}`);
		});

	function initCharts(loaded) {
		const ebanx = loaded.filter((d) => d.type === 'pct_tpv_ebanx_b2b');
		const market = loaded.filter((d) => d.type === 'market_average');

		const groupedMarket = d3.group(market, (d) => d.vertical);
		const verticals = Array.from(d3.group(ebanx, (d) => d.vertical), ([vertical, methods]) => ({
			vertical,
			methods: methods.slice().sort((a, b) => b.value - a.value),
			marketData: groupedMarket.get(vertical) ?? []
		}));

		setupLegend();
		verticals.forEach(createBarChart);
	}

	function setupLegend() {
		const item = (swatch) => {
			const row = legend
				.append('div')
				.style('display', 'flex')
				.style('align-items', 'center')
				.style('gap', '5px');
			swatch(row);
			return row;
		};

		item((row) =>
			row
				.append('div')
				.style('width', '15px')
				.style('height', '15px')
				.style('background', COLORS.purple100)
		)
			.append('span')
			.style('font-size', 'var(--text-xs)')
			.style('font-family', 'sans-serif')
			.style('color', 'var(--color-muted)')
			.text('EBANX Merchants');

		item((row) =>
			row
				.append('div')
				.style('width', '12px')
				.style('height', '12px')
				.style('background', COLORS.darkOrange)
				.style('border', `2px solid ${COLORS.lightNeonGreen}`)
				.style('border-radius', '50%')
		)
			.append('span')
			.style('font-size', 'var(--text-xs)')
			.style('font-family', 'sans-serif')
			.style('color', 'var(--color-muted)')
			.text('Market Average');
	}

	function createBarChart(verticalData) {
		// Height follows the row count instead of a fixed 200px, so verticals with
		// more payment methods don't crowd.
		const plotHeight = verticalData.methods.length * CONFIG.rowHeight;
		const height = margin.top + CONFIG.titleHeight + plotHeight + margin.bottom;

		const svg = grid
			.append('svg')
			.attr('width', chartWidth)
			.attr('height', height)
			.attr('viewBox', `0 0 ${chartWidth} ${height}`)
			.attr('preserveAspectRatio', 'xMidYMid meet');

		svg
			.append('text')
			.attr('x', 0)
			.attr('y', 15)
			.text(verticalData.vertical)
			.style('font-size', 'var(--text-xs)')
			.style('font-weight', 'bold')
			.style('font-family', 'sans-serif')
			.style('fill', 'var(--color-muted)');

		const g = svg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top + CONFIG.titleHeight})`);

		const xScale = d3.scaleLinear().domain([0, 100]).range([0, boundedWidth]);
		const yScale = d3
			.scaleBand()
			.domain(verticalData.methods.map((d) => d.method))
			.range([0, plotHeight])
			.padding(CONFIG.barPadding);

		g.selectAll('.bar')
			.data(verticalData.methods)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', 0)
			.attr('y', (d) => yScale(d.method))
			.attr('width', (d) => xScale(d.value))
			.attr('height', yScale.bandwidth())
			.attr('fill', COLORS.purple100)
			.on('mouseover', (event, d) => showValue(event, d, false))
			.on('mouseout', tooltip.hide)
			.on('click', (event, d) => {
				event.stopPropagation();
				showValue(event, d, false);
			});

		g.selectAll('.market-dot')
			.data(verticalData.marketData)
			.enter()
			.append('circle')
			.attr('class', 'market-dot')
			.attr('cx', (d) => xScale(d.value))
			.attr('cy', (d) => yScale(d.method) + yScale.bandwidth() / 2)
			.attr('r', CONFIG.marketDot.radius)
			.attr('fill', COLORS.darkOrange)
			.attr('stroke', COLORS.lightNeonGreen)
			.attr('stroke-width', CONFIG.marketDot.strokeWidth)
			.on('mouseover', (event, d) => showValue(event, d, true))
			.on('mouseout', tooltip.hide)
			.on('click', (event, d) => {
				event.stopPropagation();
				showValue(event, d, true);
			});

		g.append('g')
			.attr('class', 'xaxis')
			.attr('transform', `translate(0, ${plotHeight})`)
			.call(
				d3
					.axisBottom(xScale)
					.ticks(isMobile ? 3 : 5)
					.tickFormat((d) => `${d}%`)
			)
			.call((sel) => sel.select('.domain').remove())
			.call((sel) => sel.selectAll('.tick line').style('stroke', COLORS.chartLight))
			.call((sel) =>
				sel.selectAll('.tick text').style('fill', COLORS.chartMedium).style('font-size', '13px').style('font-family', 'sans-serif')
			);

		// Method names are drawn as plain labels rather than a y-axis, matching
		// the published chart.
		g.selectAll('.method-label')
			.data(verticalData.methods)
			.enter()
			.append('text')
			.attr('class', 'method-label')
			.attr('x', -10)
			.attr('y', (d) => yScale(d.method) + yScale.bandwidth() / 2 + 4)
			.attr('text-anchor', 'end')
			.text((d) => d.method)
			.style('font-size', '13px')
			.style('font-family', 'sans-serif')
			.style('fill', 'var(--color-muted)');
	}

	function showValue(event, d, isMarket) {
		tooltip.show(
			event,
			isMarket
				? `<strong style="color:${COLORS.darkOrange}">Market Average:</strong> ${d.value.toFixed(0)}%`
				: `<strong style="color:${COLORS.purple100}">EBANX Merchants:</strong> ${d.value.toFixed(0)}%`
		);
	}

	return () => {
		cancelled = true;
		wrapper.remove();
	};
}
