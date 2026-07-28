// -----------------------------------------------------------------------------
// WORK · GALLERY  (mix of images + videos — see folha-printed.js for the schema)
// For videos, add a `poster` frame so the grid looks good before play.
// -----------------------------------------------------------------------------
export default {
	slug: 'folha-interactive',
	title: 'Folha — Interactive', // TODO
	year: '2024', // TODO
	role: 'Interaction Design, Motion', // TODO
	type: 'gallery',
	summary: 'Interactive and motion pieces for Folha.', // TODO
	cover: '/works/folha-interactive/cover.jpg', // TODO

	media: [
		{
			type: 'video',
			src: '/works/folha-interactive/01.mp4',
			poster: '/works/folha-interactive/01.jpg',
			caption: 'Prototype walkthrough',
			span: 'full'
		},
		{ type: 'image', src: '/works/folha-interactive/02.jpg', caption: 'Screen' },
		{
			type: 'video',
			src: '/works/folha-interactive/03.mp4',
			poster: '/works/folha-interactive/03.jpg',
			caption: 'Interaction detail'
		},
		{ type: 'image', src: '/works/folha-interactive/04.jpg', caption: 'System', span: 'full' }
	]
};
