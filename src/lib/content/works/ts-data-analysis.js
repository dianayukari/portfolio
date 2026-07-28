// -----------------------------------------------------------------------------
// WORK · BLOG
// Blog-style: prose + inline images, rendered through BlogLayout (narrower
// measure, reads like an article). Same `blocks[]` schema as a case study.
// -----------------------------------------------------------------------------
export default {
	slug: 'ts-data-analysis',
	title: 'TS Data Analysis', // TODO
	year: '2025', // TODO
	role: 'Data Analysis, Writing', // TODO
	type: 'blog',
	date: 'March 2025', // shown as the article date
	summary: 'A written analysis mixing data, charts and commentary.', // TODO
	cover: '/works/ts-data-analysis/cover.jpg', // TODO

	blocks: [
		{
			type: 'text',
			value:
				'Opening of the article. Blog-style works read like a post — mix paragraphs with charts and images as you go.' // TODO
		},
		{ type: 'image', src: '/works/ts-data-analysis/chart-01.png', caption: 'Fig 1. Overview.' },
		{
			type: 'text',
			value: 'Interpret the chart above and lead into the next point.' // TODO
		},
		{ type: 'heading', value: 'Method' }, // TODO
		{
			type: 'text',
			value: 'Explain the data sources and how the analysis was done.' // TODO
		},
		{ type: 'image', src: '/works/ts-data-analysis/chart-02.png', caption: 'Fig 2. Detail.' },
		{ type: 'quote', value: 'A takeaway worth pulling out of the body text.' }, // TODO
		{ type: 'heading', value: 'Conclusion' }, // TODO
		{ type: 'text', value: 'Close the piece.' } // TODO
	]
};
