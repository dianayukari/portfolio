// -----------------------------------------------------------------------------
// Shared single-readout tooltip for the D3 charts.
// Positioned in coordinates local to `wrapper` (which must be position:relative)
// rather than the viewport, so it stays put when the page scrolls.
// -----------------------------------------------------------------------------
import * as d3 from 'd3';

export function createTooltip(wrapper) {
	const node = wrapper
		.append('div')
		.attr('class', 'chart-tooltip')
		.style('position', 'absolute')
		.style('pointer-events', 'none')
		.style('background', '#F3F3F3')
		.style('color', '#333333')
		.style('padding', '6px 10px')
		.style('border-radius', '4px')
		.style('font-size', 'var(--text-xs)')
		.style('line-height', '1.35')
		.style('white-space', 'nowrap')
		.style('box-shadow', '3px 3px 10px rgba(0, 0, 0, 0.18)')
		.style('opacity', 0)
		.style('z-index', 2)
		.style('font-family', 'sans-serif');

	return {
		node,
		show(event, html) {
			const host = wrapper.node();
			const [x, y] = d3.pointer(event, host);
			node.interrupt().html(html);

			// Flip to the left of the cursor rather than overflow the container.
			const tipWidth = node.node().offsetWidth;
			const left = x + 12 + tipWidth > host.clientWidth ? x - tipWidth - 12 : x + 12;

			node
				.style('left', `${Math.max(0, left)}px`)
				.style('top', `${y + 12}px`)
				.style('opacity', 1);
		},
		hide() {
			node.transition().duration(200).style('opacity', 0);
		}
	};
}
