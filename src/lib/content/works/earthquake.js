// -----------------------------------------------------------------------------
// WORK · CASE STUDY  (see thesis.js for the block reference)
// -----------------------------------------------------------------------------
export default {
	slug: 'earthquake',
	title: 'Earthquake Case Studies', // TODO
	year: '2023', // TODO
	role: 'Data, Editorial Design', // TODO
	type: 'case-study',
	summary: 'A one-line description of the earthquake case studies.', // TODO
	cover: '/works/earthquake/cover.jpg', // TODO

	blocks: [
		{
			type: 'text',
			value: 'Introduce the case studies and the questions they investigate.' // TODO
		},
		{ type: 'image', src: '/works/earthquake/01.jpg', caption: 'Overview', span: 'wide' },
		{ type: 'heading', value: 'Context' }, // TODO
		{ type: 'text', value: 'Background and context for the studies.' }, // TODO
		{
			type: 'columns',
			items: [
				{ type: 'image', src: '/works/earthquake/02.jpg', caption: 'Case A' },
				{ type: 'image', src: '/works/earthquake/03.jpg', caption: 'Case B' }
			]
		},
		{ type: 'heading', value: 'Findings' }, // TODO
		{ type: 'text', value: 'Discuss the findings and their implications.' }, // TODO
		{ type: 'image', src: '/works/earthquake/04.jpg', span: 'full' }
	]
};
