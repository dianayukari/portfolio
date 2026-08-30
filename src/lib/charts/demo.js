// -----------------------------------------------------------------------------
// CHART · demo  (template — copy this file per chart and rename it in index.js)
// Paste an existing D3 snippet into the body — it gets an empty `el` to draw
// into and the container's measured `width`.
//
// Rules of the house:
//   · This only ever runs in the browser (Chart.svelte calls it in onMount), so
//     `document` / `window` are safe here.
//   · It re-runs on resize with the new width, and `el` is emptied first — so
//     draw from scratch and don't cache DOM between calls.
//   · Read colours from the CSS tokens (see palette below) instead of
//     hardcoding hexes, so charts stay in step with the site.
//   · Import d3 submodules, not the `d3` meta-package, so Vite can tree-shake.
// -----------------------------------------------------------------------------
import * as d3 from 'd3';

// Site tokens, resolved at draw time (defined in src/app.css).
function palette(el) {
	const s = getComputedStyle(el);
	const token = (name, fallback) => s.getPropertyValue(name).trim() || fallback;
	return {
		fg: token('--color-fg', '#013C37'),
		muted: token('--color-muted', '#6b675c'),
		line: token('--color-line', '#D7DEDE'),
		accent: token('--color-accent', '#A65B4E'),
		bg: token('--color-bg', '#F2F2F2')
	};
}

export default function draw(el, { width, height }) {
	const c = palette(el);

	const svg = d3
		.select(el)
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', [0, 0, width, height])
		.attr('role', 'img');

	// --- your snippet goes here ------------------------------------------------
	svg
		.append('text')
		.attr('x', width / 2)
		.attr('y', height / 2)
		.attr('text-anchor', 'middle')
		.attr('fill', c.muted)
		.attr('font-size', 13)
		.text('demo chart — drop the D3 snippet into src/lib/charts/demo.js');
	// ---------------------------------------------------------------------------

	// Optional: return a teardown for anything that outlives the SVG — timers,
	// d3.timer, window listeners. Removing `svg` itself is handled for you.
	return () => {};
}
