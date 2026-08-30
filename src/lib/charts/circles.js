// -----------------------------------------------------------------------------
// CHART · circles
// Circle pack of B2B volume by country and category, one screen per market
// classification, stepped through with prev/next and dots.
//
// Everything is scoped to `draw` — nothing runs at import time, because this
// module is also imported during prerender, where there is no DOM.
// -----------------------------------------------------------------------------
import * as d3 from 'd3';
import { base } from '$app/paths';
import { createTooltip } from './_tooltip.js';

const COLORS = {
	chartLight: '#E0E0E0',
	chartMedium: '#808080',
	lightNeonGreen: '#F6FAE6'
};

const CATEGORY_RANGE = ['#C599FF', '#BA5E00', '#9C50FF', '#FFC78C', '#FF8200'];

const CONFIG = {
	margin: { top: 10, right: 20, bottom: 20, left: 20 },
	mobileBreakpoint: 768,
	circlePadding: 5,
	minLabelRadius: 20,
	maxCategoryFontSize: 13,
	baseFontSizes: { mobile: '10px', desktop: '11px' },
	actualFontSizes: { mobile: '12px', desktop: '14px' },
	labelMinDistance: { mobile: 3, desktop: 5 },
	overlapTolerance: { mobile: 0.4, desktop: 0.6 },
	labelMargins: { mobile: 5, desktop: 10 }
};

// Screen copy, matched to the classifications by position.
const DESCRIPTIONS = [
	{
		title: 'B2B Powerhouses',
		descr:
			'Large and mature B2B digital ecosystems, such as Brazil, India and Mexico, where scale is established and market presence is essential.'
	},
	{
		title: 'B2B Expansion Priorities',
		descr:
			'Markets like Chile, Argentina and the Philippines, with solid momentum and growing scale, representing the next logical step for B2B expansion.'
	},
	{
		title: 'Next-Wave B2B Markets',
		descr:
			'Early-stage B2B markets, including Kenya, Nigeria and Ecuador, which are at an early stage of development, yet display promising long-term growth dynamics.'
	}
];

const cache = new Map();

function loadData(url) {
	if (!cache.has(url)) {
		cache.set(
			url,
			d3.csv(url, (d) => ({
				country: d.country,
				category: d.category,
				class: d.classificacao,
				volume: +d.value
			}))
		);
	}
	return cache.get(url);
}

export default function draw(el, { width, height = 520, src }) {
	if (!src) {
		console.warn("[circles] no `src` — pass the CSV path in the block's `props`");
		return;
	}

	const url = /^https?:\/\//.test(src) ? src : base + src;

	let cancelled = false;
	const listeners = [];
	const isMobile = width < CONFIG.mobileBreakpoint;
	const margin = CONFIG.margin;
	const boundedWidth = width - margin.left - margin.right;
	const boundedHeight = height - margin.top - margin.bottom;

	const wrapper = d3.select(el).append('div').style('position', 'relative');

	const header = wrapper.append('div').style('margin-bottom', 'var(--space-2)');
	const screenTitle = header
		.append('p')
		.style('font-weight', 'bold')
		.style('font-size', 'var(--text-sm)')
		.style('font-family', 'sans-serif')
		.style('color', 'var(--color-muted)');
	const screenDescription = header
		.append('p')
		.style('font-size', 'var(--text-xs)')
		.style('font-family', 'sans-serif')
		.style('color', 'var(--color-muted)')
		.style('max-width', '60ch');

	const chartArea = wrapper.append('div');

	// Nav sits below the chart, above the tooltip layer in stacking order.
	const nav = wrapper
		.append('div')
		.style('display', 'flex')
		.style('align-items', 'center')
		.style('gap', 'var(--space-2)')
		.style('margin-top', 'var(--space-2)')
		.style('position', 'relative')
		.style('z-index', 1);

	const tooltip = createTooltip(wrapper);

	let circlePackData = [];
	let currentScreen = 0;
	let colorScale;
	let prevBtn, nextBtn, dots;

	loadData(url)
		.then((loaded) => {
			if (cancelled) return;
			initChart(loaded);
		})
		.catch((err) => {
			if (cancelled) return;
			console.error('[circles] could not load', url, err);
			chartArea.append('p').style('color', COLORS.chartMedium).text(`Could not load ${src}`);
		});

	function initChart(data) {
		prepareCirclePackData(data);

		const allCategories = [...new Set(data.map((d) => d.category))];
		colorScale = d3.scaleOrdinal().domain(allCategories).range(CATEGORY_RANGE);

		buildNav();
		showScreen(0);

		// Tapping outside the chart dismisses the readout.
		const onDocPointerDown = (e) => {
			if (!el.contains(e.target)) tooltip.hide();
		};
		document.addEventListener('pointerdown', onDocPointerDown);
		listeners.push(() => document.removeEventListener('pointerdown', onDocPointerDown));
	}

	function prepareCirclePackData(data) {
		const classValues = [...new Set(data.map((d) => d.class))];

		circlePackData = classValues.map((classValue) => {
			const classData = data.filter((d) => d.class === classValue);
			const countryCategories = d3.rollup(
				classData,
				(v) => d3.sum(v, (d) => d.volume),
				(d) => d.country,
				(d) => d.category
			);

			return {
				title: classValue,
				data: {
					name: classValue,
					children: Array.from(countryCategories, ([country, categories]) => ({
						name: country,
						children: Array.from(categories, ([category, volume]) => ({
							name: category,
							value: volume
						}))
					}))
				}
			};
		});
	}

	function buildNav() {
		prevBtn = navButton('← Prev', () => showScreen(currentScreen - 1));

		dots = nav
			.append('div')
			.style('display', 'flex')
			.style('gap', '6px')
			.selectAll('button')
			.data(circlePackData)
			.enter()
			.append('button')
			.attr('type', 'button')
			.attr('aria-label', (d) => d.title)
			.style('width', '9px')
			.style('height', '9px')
			.style('padding', 0)
			.style('border', 'none')
			.style('border-radius', '50%')
			.style('cursor', 'pointer')
			.on('click', (event, d) => showScreen(circlePackData.indexOf(d)));

		nextBtn = navButton('Next →', () => showScreen(currentScreen + 1));
	}

	function navButton(label, onClick) {
		return nav
			.append('button')
			.attr('type', 'button')
			.text(label)
			.style('font-family', 'sans-serif')
			.style('font-size', 'var(--text-xs)')
			.style('padding', '0.25rem 0.75rem')
			.style('border', '1px solid var(--color-line)')
			.style('border-radius', 'var(--radius)')
			.style('cursor', 'pointer')
			.on('click', onClick);
	}

	function showScreen(screenIndex) {
		if (screenIndex < 0 || screenIndex >= circlePackData.length) return;
		currentScreen = screenIndex;

		updateNavigation();
		tooltip.hide();

		const screenData = circlePackData[currentScreen];
		screenTitle.text(screenData.title);
		screenDescription.text(DESCRIPTIONS[currentScreen]?.descr ?? '');

		chartArea.selectAll('*').remove();
		createCirclePack(screenData);
	}

	function updateNavigation() {
		prevBtn.property('disabled', currentScreen === 0).style('opacity', currentScreen === 0 ? 0.4 : 1);
		const last = currentScreen === circlePackData.length - 1;
		nextBtn.property('disabled', last).style('opacity', last ? 0.4 : 1);

		dots.style('background', (d, i) =>
			i === currentScreen ? 'var(--color-fg)' : 'var(--color-line)'
		);
	}

	function createCirclePack(screenData) {
		const svg = chartArea
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('preserveAspectRatio', 'xMidYMid meet');

		const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

		const root = d3
			.hierarchy(screenData.data)
			.sum((d) => d.value)
			.sort((a, b) => b.value - a.value);

		d3.pack().size([boundedWidth, boundedHeight]).padding(CONFIG.circlePadding)(root);

		const node = g
			.selectAll('.node')
			.data(root.descendants().filter((d) => d.depth > 0))
			.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

		node
			.append('circle')
			.attr('r', (d) => d.r)
			.style('fill', (d) => (d.depth === 1 ? COLORS.chartLight : colorScale(d.data.name)))
			.style('stroke', (d) => (d.depth === 1 ? COLORS.chartLight : 'none'))
			.style('cursor', (d) => (d.depth === 1 ? 'default' : 'pointer'))
			// depth 1 is a country grouping — only the category circles carry a value.
			.on('mouseover', (event, d) => {
				if (d.depth === 1) return;
				showValue(event, d);
			})
			.on('mousemove', (event, d) => {
				if (d.depth === 1) return;
				showValue(event, d);
			})
			.on('mouseout', tooltip.hide)
			.on('click', (event, d) => {
				if (d.depth === 1) return;
				event.stopPropagation();
				showValue(event, d);
			});

		const countryNodes = root.descendants().filter((d) => d.depth === 1);
		if (countryNodes.length) createCountryLabels(g, countryNodes);

		// Category labels, only where the circle is big enough to read.
		node
			.filter((d) => d.depth > 1)
			.append('text')
			.attr('dy', '0.3em')
			.attr('x', 0)
			.style('text-anchor', 'middle')
			.style('font-family', 'sans-serif')
			.style('font-size', (d) => `${Math.min(d.r / 2, CONFIG.maxCategoryFontSize)}px`)
			.style('pointer-events', 'none')
			.each(function (d) {
				if (d.r <= CONFIG.minLabelRadius) return;

				const textElement = d3.select(this);
				const name = d.data.name;

				if (name.length > 10) {
					name.split(/\s+/).forEach((word, i) => {
						textElement
							.append('tspan')
							.attr('x', 0)
							.attr('dy', i === 0 ? '-0.1em' : '1.1em')
							.text(word);
					});
				} else {
					textElement.text(name);
				}
			});
	}

	function createCountryLabels(g, countryNodes) {
		const baseFontSize = isMobile ? CONFIG.baseFontSizes.mobile : CONFIG.baseFontSizes.desktop;
		const actualFontSize = isMobile ? CONFIG.actualFontSizes.mobile : CONFIG.actualFontSizes.desktop;

		// A hidden node, measured once, to size each label before placing it.
		const tempText = g
			.append('text')
			.style('font-size', baseFontSize)
			.style('font-family', 'sans-serif')
			.style('font-weight', 'bold')
			.style('visibility', 'hidden');

		const labelData = countryNodes.map((d) => {
			const displayText = d.data.name;
			const willSplit = shouldSplitText(displayText);

			tempText.text(willSplit ? displayText.split(/\s+/)[0] : displayText);
			const bbox = {
				width: tempText.node().getBBox().width,
				height: 16 * (willSplit ? displayText.split(/\s+/).length : 1)
			};

			const { x, y } = findOptimalPosition(d, countryNodes, bbox);
			return { text: displayText, willSplit, x, y };
		});

		tempText.remove();

		g.selectAll('.country-label')
			.data(labelData)
			.enter()
			.append('text')
			.attr('class', 'country-label')
			.attr('x', (d) => d.x)
			.attr('y', (d) => d.y)
			.style('font-size', actualFontSize)
			.style('font-family', 'sans-serif')
			.style('font-weight', 'bold')
			.style('fill', '#333')
			.style('text-anchor', 'start')
			.style('pointer-events', 'none')
			.each(function (d) {
				const textElement = d3.select(this);
				if (!d.willSplit) {
					textElement.text(d.text);
					return;
				}
				d.text.split(/\s+/).forEach((word, i) => {
					textElement
						.append('tspan')
						.attr('x', d.x)
						.attr('dy', i === 0 ? '0em' : '1.1em')
						.text(word);
				});
			});
	}

	function shouldSplitText(text) {
		return isMobile && text.split(/\s+/).length > 1 && text.length > 14;
	}

	// Tries positions around the circle in order of preference, falling back to a
	// clamped position when everything collides.
	function findOptimalPosition(targetNode, allNodes, textBbox) {
		const minDistance =
			targetNode.r + (isMobile ? CONFIG.labelMinDistance.mobile : CONFIG.labelMinDistance.desktop);

		const angles = isMobile
			? [270, 90, 180, 0, 225, 135, 315, 45] // prefer top/bottom
			: [180, 225, 135, 270, 315, 45, 90, 0]; // prefer left

		for (const angle of angles) {
			const radian = (angle * Math.PI) / 180;
			const distance = minDistance + textBbox.width * (isMobile ? 0.1 : 0.3);

			let testX = targetNode.x + Math.cos(radian) * distance;
			const testY = targetNode.y + Math.sin(radian) * distance;

			// Right-align the text when it sits to the left of the circle.
			if (angle > 90 && angle < 270) testX -= textBbox.width;

			if (isValidPosition(testX, testY, textBbox, targetNode, allNodes)) {
				return { x: testX, y: testY };
			}
		}

		return {
			x: isMobile
				? Math.min(
						Math.max(10, targetNode.x - textBbox.width / 2),
						boundedWidth - textBbox.width - 10
					)
				: Math.max(10, targetNode.x - targetNode.r - textBbox.width - 20),
			y: isMobile
				? Math.min(Math.max(textBbox.height + 10, targetNode.y - targetNode.r - 15), boundedHeight - 10)
				: targetNode.y
		};
	}

	// Bounds are checked against the plot area, not the window — these
	// coordinates live inside `g`, which is already offset by the margins.
	function isValidPosition(x, y, textBbox, targetNode, allNodes) {
		const edge = isMobile ? CONFIG.labelMargins.mobile : CONFIG.labelMargins.desktop;

		if (
			x < edge ||
			x + textBbox.width > boundedWidth - 10 ||
			y - textBbox.height < 10 ||
			y > boundedHeight - 10
		) {
			return false;
		}

		const overlapTolerance = isMobile
			? CONFIG.overlapTolerance.mobile
			: CONFIG.overlapTolerance.desktop;

		return !allNodes.some((node) => {
			if (node === targetNode) return false;
			const dx = x + textBbox.width / 2 - node.x;
			const dy = y - textBbox.height / 2 - node.y;
			const minDistance = node.r + Math.max(textBbox.width, textBbox.height) * overlapTolerance;
			return Math.hypot(dx, dy) < minDistance;
		});
	}

	function showValue(event, d) {
		tooltip.show(
			event,
			`<strong style="color:${colorScale(d.data.name)}">${d.data.name}</strong>` +
				`<strong> in ${d.parent.data.name}</strong><br/>USD ${d.value.toFixed(2)} bi`
		);
	}

	return () => {
		cancelled = true;
		listeners.forEach((off) => off());
		wrapper.remove();
	};
}
