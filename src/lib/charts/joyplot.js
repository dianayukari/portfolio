// -----------------------------------------------------------------------------
// CHART · joyplot
// Ridgeline of payment-method share over time, with a transactions/volume
// toggle and a per-ridge hover readout.
//
// Everything is scoped to `draw` — nothing runs at import time, because this
// module is also imported during prerender, where there is no DOM.
// -----------------------------------------------------------------------------
import * as d3 from 'd3';
import { base } from '$app/paths';

// EBANX brand palette — kept as published rather than mapped to site tokens,
// since the case study is showing the chart as it shipped.
const COLORS = {
	aqua: '#4BDBBA',
	purple100: '#9C50FF',
	chartLight: '#E0E0E0',
	chartMedium: '#808080',
	pixHighlight: '#2C806C'
};

const CONFIG = {
	// `top` has to clear the tallest ridge, which overshoots its own band by up to
	// bandwidth * (multiplier - 1).
	margin: { top: 96, right: 48, bottom: 40, left: 130 },
	padding: 10,
	multiplier: 1.6,
	hoverCircleRadius: 4,
	mobileBreakpoint: 480,
	areaFillOpacity: 0.6,
	areaStrokeWidth: 1,
	labelOffset: 10,
	yAxisOffset: 5,
	hoverLineDashArray: '4',
	transitionDuration: 1200,
	tooltipFadeDuration: 200,
	tooltip: { width: 130, offsetX: 10, offsetY: 15 }
};

const VARIABLES = [
	{ key: 'transactions', label: 'Transactions' },
	{ key: 'volume', label: 'Volume' }
];

// One fetch per CSV per session — the chart redraws on every resize, and the
// data doesn't change between draws.
const cache = new Map();

function loadData(url) {
	if (!cache.has(url)) {
		cache.set(
			url,
			d3.csv(url, (d) => ({
				group: d.payment_method,
				date: d.date,
				transactions: +d.transactions * 100,
				volume: +d.value * 100,
				orderTransaction: +d.order_transaction,
				orderVolume: +d.order_volume
			}))
		);
	}
	return cache.get(url);
}

export default function draw(el, { width, height = 640, src }) {
	if (!src) {
		console.warn("[joyplot] no `src` — pass the CSV path in the block's `props`");
		return;
	}

	// Relative URLs would resolve against /work/<slug>/, not the site root.
	const url = /^https?:\/\//.test(src) ? src : base + src;

	// Guards against the container being resized (or the page left) while the
	// CSV request is still in flight.
	let cancelled = false;
	const listeners = [];

	const isMobile = width < CONFIG.mobileBreakpoint;
	const margin = {
		...CONFIG.margin,
		// The left margin exists to hold group labels; don't let it eat a narrow
		// column whole.
		left: Math.min(CONFIG.margin.left, Math.round(width * 0.3)),
		right: isMobile ? 28 : CONFIG.margin.right
	};
	const boundedWidth = width - margin.left - margin.right;
	const boundedHeight = height - margin.top - margin.bottom;

	// Wrapper is the positioning context for the tooltips, so they can be placed
	// in chart coordinates instead of viewport ones.
	const wrapper = d3.select(el).append('div').style('position', 'relative');

	const controls = wrapper
		.append('div')
		.style('display', 'flex')
		.style('gap', '0.5rem')
		.style('margin-bottom', 'var(--space-2)')
		// Keeps the buttons above the SVG, which paints later in DOM order.
		.style('position', 'relative')
		.style('z-index', 1);

	const svg = wrapper
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', `0 0 ${width} ${height}`)
		.attr('preserveAspectRatio', 'xMidYMid meet');

	const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
	const tooltipContainer = wrapper.append('div').style('pointer-events', 'none');

	let currentVar = 'transactions';
	let data, groupsWithOrder, orderedGroups, quarterData;
	let xScale, yScale, yGroupScale, densityScale, areaGenerator, xAxis, yAxis;
	let yAxisG, hoverLine, hoverCircles, groupTooltips;

	loadData(url)
		.then((loaded) => {
			if (cancelled) return;
			data = loaded;
			initChart();
		})
		.catch((err) => {
			if (cancelled) return;
			console.error('[joyplot] could not load', url, err);
			g.append('text')
				.attr('fill', COLORS.chartMedium)
				.attr('font-size', 13)
				.text(`Could not load ${src}`);
		});

	function initChart() {
		groupsWithOrder = [...new Set(data.map((d) => d.group))].map((groupName) => {
			const sampleRow = data.find((d) => d.group === groupName);
			return {
				group: groupName,
				orderTransaction: sampleRow.orderTransaction,
				orderVolume: sampleRow.orderVolume
			};
		});
		orderedGroups = getOrderedGroups();

		xScale = d3
			.scalePoint()
			.domain([...new Set(data.map((d) => d.date))].sort())
			.range([0, boundedWidth]);

		xAxis = d3
			.axisBottom(xScale)
			.tickValues(q1Ticks())
			.tickFormat((d) => d.split('-')[0]);

		// Negative inner padding overlaps the bands — the ridgeline effect.
		yGroupScale = d3.scaleBand().domain(orderedGroups).range([0, boundedHeight]).paddingInner(-0.5);

		yScale = d3.scaleLinear().range([yGroupScale.bandwidth() * CONFIG.multiplier, 0]);
		densityScale = d3.scaleLinear().range([0, yGroupScale.bandwidth() * CONFIG.multiplier]);
		yAxis = d3.axisRight(yScale).ticks(4);
		setVariableScales();

		areaGenerator = d3
			.area()
			.x((d) => xScale(d.date))
			.y0((d) => yGroupScale(d.group) + yGroupScale.bandwidth())
			.y1((d) => yGroupScale(d.group) + yGroupScale.bandwidth() - densityScale(d[currentVar]))
			.curve(d3.curveBasis);

		g.append('g')
			.attr('class', 'axis xaxis')
			.attr('transform', `translate(0, ${boundedHeight + CONFIG.padding})`)
			.call(xAxis)
			.call((sel) => sel.select('.domain').remove())
			.call((sel) => sel.selectAll('.tick line').style('stroke', COLORS.chartLight))
			.call((sel) => sel.selectAll('.tick text').style('fill', COLORS.chartMedium));

		yAxisG = g.append('g').attr('class', 'axis yaxis');
		drawYAxis();

		groupsWithOrder.forEach((group) => {
			g.append('path')
				.datum(data.filter((d) => d.group === group.group))
				.attr('class', 'joyplot')
				.attr('d', areaGenerator)
				.style('fill', group.group === 'PIX' ? COLORS.purple100 : COLORS.aqua)
				.style('fill-opacity', CONFIG.areaFillOpacity)
				.style('stroke', 'white')
				.style('stroke-width', CONFIG.areaStrokeWidth);
		});

		g.selectAll('.group-label')
			.data(groupsWithOrder)
			.enter()
			.append('text')
			.attr('class', 'group-label')
			.attr('x', -CONFIG.labelOffset)
			.attr('y', (d) => yGroupScale(d.group) + yGroupScale.bandwidth())
			.attr('text-anchor', 'end')
			.attr('font-size', isMobile ? 10 : 12)
			.text((d) => d.group)
			.style('fill', COLORS.chartMedium)
			.style('font-family', 'sans-serif');

		hoverLine = g
			.append('line')
			.attr('class', 'hover-line')
			.style('stroke', COLORS.chartMedium)
			.style('stroke-dasharray', CONFIG.hoverLineDashArray)
			.style('opacity', 0);

		hoverCircles = g
			.selectAll('.hover-circle')
			.data(orderedGroups)
			.enter()
			.append('circle')
			.attr('class', 'hover-circle')
			.attr('r', CONFIG.hoverCircleRadius)
			.style('fill', COLORS.chartMedium)
			.style('opacity', 0);

		// The tallest ridge rises above its own band, so the hover target has to
		// reach above `g`'s origin — but never past the top of the SVG. The svg is
		// `overflow: visible`, so an unclamped rect would stay hit-testable outside
		// the element and swallow clicks on the controls sitting above it.
		const maxAreaHeight = Math.min(densityScale(densityScale.domain()[1]), margin.top);
		g.append('rect')
			.attr('class', 'overlay')
			.attr('y', -maxAreaHeight)
			.attr('width', boundedWidth)
			.attr('height', boundedHeight + maxAreaHeight)
			.style('opacity', 0)
			.on('mousemove', handleMouseMove)
			.on('mouseleave', hideVerticalHover);

		groupTooltips = createGroupTooltips();
		buildControls();

		// Tapping anywhere else dismisses the readout on touch devices.
		const onDocPointerDown = (e) => {
			if (!el.contains(e.target)) hideVerticalHover();
		};
		document.addEventListener('pointerdown', onDocPointerDown);
		listeners.push(() => document.removeEventListener('pointerdown', onDocPointerDown));
	}

	// Q1 ticks only, halved again on narrow columns so the years don't collide.
	function q1Ticks() {
		const quarters = [...new Set(data.map((d) => d.date))].sort().filter((q) => q.endsWith('-Q1'));
		return isMobile ? quarters.filter((d, i) => i % 2 === 0) : quarters;
	}

	// Both value scales depend on the active variable — recompute on toggle,
	// otherwise the ridges are drawn against the other variable's maximum.
	function setVariableScales() {
		const maxValue = d3.max(data, (d) => d[currentVar]);
		yScale.domain([0, maxValue]);
		densityScale.domain([0, maxValue]);
	}

	function drawYAxis() {
		const firstGroupY = yGroupScale(orderedGroups[0]);
		const top = firstGroupY + yGroupScale.bandwidth() - yGroupScale.bandwidth() * CONFIG.multiplier;
		yAxisG
			.attr('transform', `translate(${boundedWidth + CONFIG.yAxisOffset}, ${top})`)
			.call(yAxis)
			.call((sel) => sel.select('.domain').remove())
			.call((sel) => sel.selectAll('.tick line').style('stroke', COLORS.chartLight))
			.call((sel) => sel.selectAll('.tick text').style('fill', COLORS.chartMedium));
	}

	function buildControls() {
		controls
			.selectAll('button')
			.data(VARIABLES)
			.enter()
			.append('button')
			.attr('type', 'button')
			.text((d) => d.label)
			.style('font-family', 'sans-serif')
			.style('font-size', 'var(--text-xs)')
			.style('padding', '0.25rem 0.75rem')
			.style('border', `1px solid var(--color-line)`)
			.style('border-radius', 'var(--radius)')
			.style('cursor', 'pointer')
			.on('click', (event, d) => updateChart(d.key))
			.call(styleControls);
	}

	function styleControls(sel) {
		sel
			.style('background', (d) => (d.key === currentVar ? 'var(--color-fg)' : 'transparent'))
			.style('color', (d) => (d.key === currentVar ? 'var(--color-bg)' : 'var(--color-muted)'))
			.attr('aria-pressed', (d) => d.key === currentVar);
	}

	function getOrderedGroups() {
		return groupsWithOrder
			.slice()
			.sort((a, b) =>
				currentVar === 'transactions'
					? a.orderTransaction - b.orderTransaction
					: a.orderVolume - b.orderVolume
			)
			.map((d) => d.group);
	}

	function createGroupTooltips() {
		return orderedGroups.map((groupName) =>
			tooltipContainer
				.append('div')
				.attr('class', `tooltip tooltip-${groupName.replace(/\s+/g, '-')}`)
				.style('position', 'absolute')
				.style('background', '#F3F3F3')
				.style('color', '#333333')
				.style('padding', '6px 10px')
				.style('border-radius', '4px')
				.style('font-size', 'var(--text-xs)')
				.style('font-family', 'sans-serif')
				.style('pointer-events', 'none')
				.style('opacity', 0)
				.style('white-space', 'nowrap')
				.style('box-shadow', `3px 3px 10px ${COLORS.chartMedium}`)
		);
	}

	function getHighestPointAtX() {
		if (!quarterData?.length) return 0;
		const minY = d3.min(
			quarterData,
			(d) => yGroupScale(d.group) + yGroupScale.bandwidth() - densityScale(d[currentVar])
		);
		return minY ?? 0;
	}

	function hideVerticalHover() {
		hoverLine?.style('opacity', 0);
		hoverCircles?.style('opacity', 0);
		groupTooltips?.forEach((t) =>
			t.transition().duration(CONFIG.tooltipFadeDuration).style('opacity', 0)
		);
	}

	function handleMouseMove(e) {
		const [mouseX] = d3.pointer(e);

		const closestQuarter = d3.least(xScale.domain(), (q) => Math.abs(mouseX - xScale(q)));
		const x = xScale(closestQuarter);
		quarterData = data.filter((d) => d.date === closestQuarter);

		hoverLine
			.attr('x1', x)
			.attr('x2', x)
			.attr('y1', getHighestPointAtX())
			.attr('y2', boundedHeight)
			.style('opacity', 1);

		const [year, quarter] = closestQuarter.split('-');

		orderedGroups.forEach((groupName, index) => {
			const groupData = quarterData.find((d) => d.group === groupName);
			const tooltip = groupTooltips[index];

			if (!groupData || !tooltip) {
				hoverCircles.filter((d) => d === groupName).style('opacity', 0);
				tooltip?.transition().duration(CONFIG.tooltipFadeDuration).style('opacity', 0);
				return;
			}

			const y =
				yGroupScale(groupData.group) +
				yGroupScale.bandwidth() -
				densityScale(groupData[currentVar]);

			hoverCircles
				.filter((d) => d === groupName)
				.style('opacity', 1)
				.attr('cx', x)
				.attr('cy', y);

			// Coordinates are relative to `wrapper`, so the readout stays put when
			// the page scrolls or the chart sits in a narrower column.
			const localX = margin.left + x;
			const localY = margin.top + y;
			const flip = localX + CONFIG.tooltip.offsetX + CONFIG.tooltip.width > width;

			tooltip
				.style('top', `${localY - CONFIG.tooltip.offsetY}px`)
				.style('left', flip ? 'auto' : `${localX + CONFIG.tooltip.offsetX}px`)
				.style('right', flip ? `${width - localX + CONFIG.tooltip.offsetX}px` : 'auto')
				.html(
					`<div style="font-weight:bold;color:${
						groupName === 'PIX' ? COLORS.purple100 : COLORS.pixHighlight
					}">${groupData.group}</div>` +
						`<div><strong>${year} ${quarter}:</strong> ${groupData[currentVar].toFixed(0)}%</div>`
				)
				.style('opacity', 1);
		});
	}

	function updateChart(newVar) {
		if (newVar === currentVar) return;
		currentVar = newVar;

		hideVerticalHover();
		controls.selectAll('button').call(styleControls);

		orderedGroups = getOrderedGroups();
		yGroupScale.domain(orderedGroups);
		setVariableScales();
		drawYAxis();

		// Tooltips are rebuilt because the group order changed; the old nodes have
		// to go, or a set accumulates on every toggle.
		tooltipContainer.selectAll('*').remove();
		groupTooltips = createGroupTooltips();

		g.selectAll('.joyplot')
			.transition()
			.duration(CONFIG.transitionDuration)
			.ease(d3.easeQuadInOut)
			.attr('d', areaGenerator);

		g.selectAll('.group-label')
			.transition()
			.duration(CONFIG.transitionDuration)
			.ease(d3.easeQuadInOut)
			.attr('y', (d) => yGroupScale(d.group) + yGroupScale.bandwidth());

		hoverCircles.data(orderedGroups);
	}

	return () => {
		cancelled = true;
		listeners.forEach((off) => off());
		wrapper.remove();
	};
}
