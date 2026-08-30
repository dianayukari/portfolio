// -----------------------------------------------------------------------------
// WORK · GALLERY
// A gallery renders `media[]` in a grid through GalleryLayout.
// Media item: { type:'image'|'video', src, caption?, alt?, poster?,
//               span?: 'full'(spans the row) | 'half'(default) }
// Click any item to open it in a lightbox.
// -----------------------------------------------------------------------------
export default {
	slug: 'folha-printed',
	title: 'Folha — Printed', 
	year: '2019-2024', 
	publication: 'Folha de S.Paulo',
	role: 'Data Visualization', 
	type: 'gallery',
	summary: 'Selected printed pieces for the newspaper Folha de S.Paulo.', 
	cover: '/works/folha-printed/cover.jpg',

	links: [
		{ label: 'See online', href: 'https://www1.folha.uol.com.br/autores/diana-yukari.shtml' }
	],

	media: [
		{ type: 'image', src: '/works/folha-printed/01.jpg', caption: `Brazil's Covid-19 death toll from the first case to 60,713`},
		// { type: 'image', src: '/works/folha-printed/02.jpg', caption: 'Cover' },
		{ type: 'image', src: '/works/folha-printed/03.jpg', caption: 'Brazilian soccer teams play more matches than teams from any other country.' },
		{ type: 'image', src: '/works/folha-printed/04spread.png', caption: 'Analysis of how much influence swimming suits had in the history of swimming competitions on the Olympics', span: 'full' },
		{ type: 'image', src: '/works/folha-printed/05.jpg', caption: 'Placing the 32 Brazilian political parties on an ideological scale, taking into consideration 7 different metrics. Each flower represents a party, and each petal is a metric analyzed.' },
		{ type: 'image', src: '/works/folha-printed/06.jpg', caption: 'Cover of the newspaper the day of the publication' },
		{ type: 'image', src: '/works/folha-printed/07.jpg', caption: 'Bolsonaro’s lives are often about fishing even during the coronavirus crisis'},
		{ type: 'image', src: '/works/folha-printed/08.jpg', caption: 'Analysis of President Bolsonaro’s live transmissions.' },
		{ type: 'image', src: '/works/folha-printed/09.jpg', caption: 'The ideological movement of the parliament is represented by ternaries, each edge representing the left, the right, and the center.' },
		{ type: 'image', src: '/works/folha-printed/10.jpg', caption: 'Party distance from the PT across six governments, calculated from 3,752 floor votes in the Chamber of Deputies.'},
		{ type: 'image', src: '/works/folha-printed/11spread.jpg', caption: 'How cities voted in the presidential election and how many families were beneficiaries of the main social welfare program in each of them.', span: 'full' },
		{ type: 'image', src: '/works/folha-printed/12.jpg', caption: 'Folha’s twitter tracking tool goes through an update year, the visualization represents the 2020 update' },
		{ type: 'image', src: '/works/folha-printed/13.jpg', caption: 'Printed page from the day of publication' },
		{ type: 'image', src: '/works/folha-printed/14.jpg', caption: 'Every block in São Paulo classified by use, shown as one treemap per district across all 96 districts.' },
		{ type: 'image', src: '/works/folha-printed/15.jpg', caption: 'Geolocated police reports of phone theft tracing the routes of Carnaval blocos' }
	]
};
