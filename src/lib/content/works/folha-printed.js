// -----------------------------------------------------------------------------
// WORK · GALLERY
// A gallery renders `media[]` in a grid through GalleryLayout.
// Media item: { type:'image'|'video', src, caption?, alt?, poster?,
//               span?: 'full'(spans the row) | 'half'(default) }
// Click any item to open it in a lightbox.
// -----------------------------------------------------------------------------
export default {
	slug: 'folha-printed',
	title: 'Folha — Printed', // TODO
	year: '2023', // TODO
	role: 'Editorial Design', // TODO
	type: 'gallery',
	summary: 'Selected printed pieces for Folha.', // TODO
	cover: '/works/folha-printed/cover.jpg', // TODO

	media: [
		{ type: 'image', src: '/works/folha-printed/01.jpg', caption: 'Spread 01', span: 'full' },
		{ type: 'image', src: '/works/folha-printed/02.jpg', caption: 'Cover' },
		{ type: 'image', src: '/works/folha-printed/03.jpg', caption: 'Detail' },
		{ type: 'image', src: '/works/folha-printed/04.jpg', caption: 'Spread 02', span: 'full' },
		{ type: 'image', src: '/works/folha-printed/05.jpg', caption: 'Grid' },
		{ type: 'image', src: '/works/folha-printed/06.jpg', caption: 'Type' }
	]
};
