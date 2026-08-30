// -----------------------------------------------------------------------------
// WORK · GALLERY  (mix of images + videos — see folha-printed.js for the schema)
// For videos, add a `poster` frame so the grid looks good before play.
// -----------------------------------------------------------------------------
export default {
	slug: 'folha-interactive',
	title: 'Folha — Interactive Tools',
	year: '2020 - 2024',
	publication: 'Folha de S.Paulo',
	role: 'UI Design, Development', 
	type: 'gallery',
	summary: 'Small interactive tools that let readers query a dataset',
	cover: '/works/folha-interactive/cover.png', 

	links: [
		{ label: 'Open live', href: 'https://www1.folha.uol.com.br/autores/diana-yukari.shtm' }
	],

	media: [
		// {
		// 	type: 'video',
		// 	src: '/works/folha-interactive/01.mp4',
		// 	poster: '/works/folha-interactive/01.jpg',
		// 	caption: 'Prototype walkthrough',
		// 	span: 'full'
		// },
		{ type: 'image', 
			src: '/works/folha-interactive/simulator1turno.gif', 
			caption: 'Distribute votes from each state to one of the main candidates in the 2020 Brazilian election' },
		{ type: 'image', 
			src: '/works/folha-interactive/simulator2turno.gif', 
			caption: 'Distribute votes from other candidates to the ones that moved to the second turn in the 2020 Brazilian election' },
		{ type: 'image', 
			src: '/works/folha-interactive/esgoto.gif', 
			caption: 'Pick a Brazilian state and the beeswarm shows which countries match its sewage coverage rate, from Cuba to Sweden' },
		{ type: 'image', 
			src: '/works/folha-interactive/sp.gif', 
			caption: `Search any of São Paulo's districts to see its land use mapped block by block and broken down as a treemap.` },
		{ type: 'image', 
			src: '/works/folha-interactive/petalas1.gif', 
			caption: 'Placing the 32 Brazilian political parties on an ideological scale, taking into consideration 7 different metrics. Each flower represents a party, and each petal is a metric analyzed' },
		{ type: 'image', 
			src: '/works/folha-interactive/petalas2.gif', 
			caption: 'Comparing two parties in each of the 7 metrics' },
		{ type: 'image', 
			src: '/works/folha-interactive/taylor1.gif', 
			caption: `The Eras Tour setlist plotted by Spotify's positivity, danceability and energy scores, with each bar playing its track.` },
		{ type: 'image', 
			src: '/works/folha-interactive/taylor2.gif', 
			caption: `Swap songs into the Eras Tour setlist and compare how your version's curve reshapes against the original.` },
	]
};
