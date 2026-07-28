// -----------------------------------------------------------------------------
// WORK · CASE STUDY
// A case study renders `blocks[]` in order through CaseStudyLayout.
// Block types: 'text' | 'heading' | 'quote' | 'image' | 'video' | 'columns'
//   image/video: { type, src, caption?, alt?, span?: 'default'|'wide'|'full', poster? }
//   columns:     { type:'columns', items:[ <image/video block>, ... ] }
// Media paths point into /static/works/<slug>/ — drop your files there.
// -----------------------------------------------------------------------------
export default {
	slug: 'thesis',
	title: 'Thesis Design Project', // TODO
	year: '2024', // TODO
	role: 'Research, Design', // TODO
	type: 'case-study',
	summary: 'A one-line description of the thesis project shown on the index.', // TODO
	cover: '/works/thesis/cover.jpg', // TODO

	blocks: [
		{
			type: 'text',
			value:
				'Opening paragraph — set up the problem, the brief, and what this project set out to explore. Replace with your own writing.' // TODO
		},
		{
			type: 'image',
			src: '/works/thesis/01.jpg',
			caption: 'Figure caption goes here.',
			span: 'wide'
		},
		{ type: 'heading', value: 'Research' }, // TODO
		{
			type: 'text',
			value: 'Describe the research phase, methods, and key findings.' // TODO
		},
		{
			type: 'columns',
			items: [
				{ type: 'image', src: '/works/thesis/02.jpg', caption: 'Left' },
				{ type: 'image', src: '/works/thesis/03.jpg', caption: 'Right' }
			]
		},
		{ type: 'quote', value: 'A pull-quote or key insight from the project.' }, // TODO
		{ type: 'heading', value: 'Outcome' }, // TODO
		{
			type: 'text',
			value: 'Wrap up with the outcome, reflection, and results.' // TODO
		},
		{ type: 'image', src: '/works/thesis/04.jpg', span: 'full' }
	]
};
