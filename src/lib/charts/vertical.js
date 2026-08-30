// -----------------------------------------------------------------------------
// CHART · vertical
// Beeswarm of payment-method share by e-commerce vertical. Each dot is one
// country/method pair; hovering or clicking highlights every dot for that
// country across all verticals.
//
// Everything is scoped to `draw` — nothing runs at import time, because this
// module is also imported during prerender, where there is no DOM.
// -----------------------------------------------------------------------------
import * as d3 from 'd3';
import { base } from '$app/paths';
import { createTooltip } from './_tooltip.js';

const COLORS = {
	aqua: '#4BDBBA',
	purple100: '#9C50FF',
	chartLight: '#E0E0E0',
	chartMedium: '#808080'
};

const CONFIG = {
	margin: { top: 10, right: 16, bottom: 28, left: 120 },
	circleRadius: { default: 4, highlighted: 6 },
	defaultOpacity: 0.6,
	collidePadding: 2,
	simulationTicks: 300,
	mobileBreakpoint: 480
};

const cache = new Map();

function loadData(url) {
	if (!cache.has(url)) {
		cache.set(
			url,
			d3.csv(url, (d) => ({
				country: d.country,
				category: d.category,
				catSplit: d.category_split,
				value: +d.value * 100
			}))
		);
	}
	return cache.get(url);
}

export default function draw(el, { width, height = 460, src }) {
	if (!src) {
		console.warn("[vertical] no `src` — pass the CSV path in the block's `props`");
		return;
	}

	const url = /^https?:\/\//.test(src) ? src : base + src;

	let cancelled = false;
	const isMobile = width < CONFIG.mobileBreakpoint;
	const margin = {
		...CONFIG.margin,
		left: Math.min(CONFIG.margin.left, Math.round(width * 0.32))
	};
	const boundedWidth = width - margin.left - margin.right;
	const boundedHeight = height - margin.top - margin.bottom;

	const wrapper = d3.select(el).append('div').style('position', 'relative');
	const svg = wrapper
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', `0 0 ${width} ${height}`)
		.attr('preserveAspectRatio', 'xMidYMid meet');

	const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
	const tooltip = createTooltip(wrapper);

	let selectedCountry = null;
	let circles;

	loadData(url)
		.then((loaded) => {
			if (cancelled) return;
			initChart(loaded);
		})
		.catch((err) => {
			if (cancelled) return;
			console.error('[vertical] could not load', url, err);
			g.append('text')
				.attr('fill', COLORS.chartMedium)
				.attr('font-size', 13)
				.text(`Could not load ${src}`);
		});

	function initChart(loaded) {
		// The force simulation writes x/y/vx/vy onto the objects it's given, and
		// the loaded rows are cached and reused across redraws — so simulate over
		// copies, not the cached originals.
		const data = loaded.map((d) => ({ ...d }));
		const categories = [...new Set(data.map((d) => d.category))];

		// padding(1) collapses the bandwidth to zero, giving one line per category.
		const yScale = d3.scaleBand().domain(categories).range([0, boundedHeight]).padding(1);

		const xScale = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value)])
			.nice()
			.range([0, boundedWidth]);

		d3.forceSimulation(data)
			.force(
				'x',
				d3.forceX((d) => xScale(d.value)).strength(1)
			)
			.force(
				'y',
				d3.forceY((d) => yScale(d.category))
			)
			.force('collide', d3.forceCollide(CONFIG.circleRadius.default + CONFIG.collidePadding))
			.stop()
			.tick(CONFIG.simulationTicks);

		// Axes are scoped to this chart's `g`. Selecting them globally (as the
		// original did) would restyle every other chart on the page.
		g.append('g')
			.attr('class', 'xaxis')
			.attr('transform', `translate(0, ${boundedHeight})`)
			.call(
				d3
					.axisBottom(xScale)
					.ticks(isMobile ? 4 : 6)
					.tickFormat((d) => `${d}%`)
			)
			.call((sel) => sel.select('.domain').remove())
			.call((sel) => sel.selectAll('.tick line').attr('stroke', COLORS.chartLight))
			.call((sel) =>
				sel.selectAll('.tick text').attr('fill', COLORS.chartMedium).style('font-size', '13px')
			);

		g.append('g')
			.attr('class', 'yaxis')
			.attr('transform', 'translate(-10, 0)')
			.call(d3.axisLeft(yScale).tickSize(-boundedWidth - 10))
			.call((sel) => sel.select('.domain').remove())
			.call((sel) => sel.selectAll('.tick line').attr('stroke', COLORS.chartLight))
			.call((sel) =>
				sel.selectAll('.tick text').attr('fill', COLORS.chartMedium).style('font-size', '13px')
			);

		circles = g
			.selectAll('.circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('class', 'circle')
			.attr('r', CONFIG.circleRadius.default)
			.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y)
			.attr('fill', COLORS.aqua)
			.style('cursor', 'pointer')
			.style('opacity', CONFIG.defaultOpacity);

		circles
			.on('mouseover', (event, d) => {
				highlight(d.country);
				tooltip.show(
					event,
					`<strong style="color:${COLORS.purple100}">${d.country}</strong><br/>` +
						`<strong>${d.catSplit}:</strong> ${d.value.toFixed(0)}%`
				);
			})
			.on('mouseout', () => {
				// A pinned country survives mouseout; only the readout goes.
				highlight(selectedCountry);
				tooltip.hide();
			})
			.on('click', (event, d) => {
				event.stopPropagation();
				selectedCountry = selectedCountry === d.country ? null : d.country;
				highlight(selectedCountry);
			});

		// Clicking the background clears a pinned country.
		svg.on('click', () => {
			selectedCountry = null;
			highlight(null);
			tooltip.hide();
		});
	}

	// Selections are scoped to this chart, so two beeswarms on one page don't
	// highlight each other.
	function highlight(country) {
		if (!circles) return;
		if (!country) {
			circles
				.attr('r', CONFIG.circleRadius.default)
				.attr('fill', COLORS.aqua)
				.style('opacity', CONFIG.defaultOpacity);
			return;
		}
		circles
			.attr('r', (d) =>
				d.country === country ? CONFIG.circleRadius.highlighted : CONFIG.circleRadius.default
			)
			.attr('fill', (d) => (d.country === country ? COLORS.purple100 : COLORS.aqua))
			.style('opacity', (d) => (d.country === country ? 1 : CONFIG.defaultOpacity));
	}

	return () => {
		cancelled = true;
		wrapper.remove();
	};
}
