// -----------------------------------------------------------------------------
// CHARTS INDEX  —  registry of interactive D3 charts, keyed by name.
// A content file references a chart by that key:
//     { type: 'chart', name: 'joyplot', span: 'wide', props: { src: '…' } }
//
// Each chart module default-exports a draw function:
//     export default function draw(el, { width, height, ...props }) { … }
// It receives an empty container and the measured width, and may return a
// teardown function. See demo.js for the shape.
//
// Entries are dynamic imports on purpose: d3 is heavy, and this keeps it (and
// each chart) out of the bundle for every page that doesn't render one.
// -----------------------------------------------------------------------------
export const charts = {
	demo: () => import('./demo.js'),
	joyplot: () => import('./joyplot.js'),
	vertical: () => import('./vertical.js'),
	b2b: () => import('./b2b_br.js'),
	circles: () => import('./circles.js')
};

export default charts;
