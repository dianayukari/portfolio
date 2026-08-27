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
	title: 'No Climate Commitment Built Here Stands',
	year: '2026',
	publication: `Master's graduation project`,
	role: 'Research, Design',
	type: 'case-study',
	summary: `An installation that rewrites a visitor's climate demand into policy language, and documents what the rewrite removed.`,
	cover: '/works/thesis/cover.png',

	links: [
		{ label: 'Read the thesis', href: 'https://drive.google.com/file/d/16z8pFZboJ2gr5Vkm_DzrB9bEmZhuDLSx/view' },
		{ label: `Project's data`, href: 'https://dianayukari.github.io/climatecommitmentrefs/' }
	],

	blocks: [
		{
			type: 'text',
			value:
				`Climate policy language weakens as it travels. A demand stated as obligation in an IPCC assessment arrives in national policy as a preference: must becomes should, deadlines become ambitions, actors dissolve into passive constructions. The problem is still named, but the commitment to act on it disappears.`
		},
		{
			type: 'text',
			value:
				`The project has two parts. A written thesis that measures this weakening across a corpus of matched passages, and an installation that performs it once, on a sentence the visitor writes themselves.`
		},
		{
			type: 'columns',
			items: [
				{ type: 'image', src: '/works/thesis/installation-dark.png'},
				{ type: 'image', src: '/works/thesis/installation-light.png'}
			]
		},
		{ type: 'heading', value: 'Thesis: the research' }, // TODO
		{
			type: 'text',
			value: `The thesis pairs 192 semantically matched passages from the Portuguese edition of the IPCC AR6 Synthesis Report against four Brazilian federal climate documents, written across three administrations. Matching is computational: passages aligned by embedding similarity, uncertainty markers extracted and sorted into five outcomes: the claim survives, its confidence shifts, its type of uncertainty shifts, it disappears, or it appears with no source in the science at all.`
		},
		{
			type: 'text',
			value: `The dominant result is absence. 76.6% of calibrated uncertainty language is erased in translation, rising to 83.8% in the NDC, the document with the most political weight. Confidence levels are rarely adjusted outright, which would leave a traceable contradiction; instead uncertainty migrates from auditable forms into unauditable ones, and new conditionality appears around commitments the science never qualified.`
		},
		{
			type: 'text',
			value: `The transformation runs in one direction. Certainty hardens around the problem and softens around the response, letting a state name the crisis with full scientific authority while attaching no measurable obligation to itself. The thesis calls this directed domestication, after Venuti.`
		},
		{
			type: 'image',
			src: '/works/thesis/book.png',
			caption: 'Figure caption goes here.',
		},
		// { type: 'quote', value: 'A pull-quote or key insight from the project.' }, // TODO
		{ type: 'heading', value: 'From thesis to installation' },
		{
			type: 'text',
			value: 'The thesis result depends on scale: 192 pairs are what demonstrate the pattern is consistent rather than anecdotal. I felt that form of evidence did not transfer to an exhibition, so the installation does not present the corpus. It applies the transformation once, to a sentence the visitor wrote themself.' 
		},
		{ type: 'image', src: '/works/thesis/04.jpg', span: 'full' },
		{ type: 'heading', value: 'Installation' },
		{
			type: 'text',
			value: 'A visitor walks up to a steel totem holding a screen and a keyboard, reads the prompt, and types one sentence. The system takes the sentence, rewrites it, and shows what changed. After two to three minutes the screen clears and waits for the next person. This is what happens on screen:' 
		},
		{ type: 'list', items: [
			'Prompt: Submit a climate demand. The visitor types.',
			'Processing: The sentence is transformed by a language model running locally on the machine. There is no confirmation step.',
			'Annotation: The transformation returns, marked at word level: must → should · modal softened.',
			'Citation: One word is isolated and documented: where that construction appears in real national policy, and in which document. The model is constrained to a pre-researched lexicon, so every flagged word has evidence behind it.',
			'Closing: Inaction happens in every translation from demand to policy. The problem stays named; the obligation disappears. You just made one.'
		]},
		{
			type: 'columns',
			items: [
				{ type: 'image', src: '/works/thesis/screen1.jpg', caption: 'Prompt' },
				{ type: 'image', src: '/works/thesis/screen2.jpg', caption: 'Annotation' },
				{ type: 'image', src: '/works/thesis/screen3.jpg', caption: 'Citation' },
				{ type: 'image', src: '/works/thesis/screen4.jpg', caption: 'Closing' }
			]
		},
		{ type: 'heading', value: 'Form' },
		{
			type: 'text',
			value: 'Scaffold-grade steel angle stock, painted matte black, with a concrete slab as ballast. The monitor is mounted in portrait. The computer, keyboard and cabling are left visible rather than enclosed. The structure is built to be transported and reassembled, and is not finished beyond that requirement.' 
		},
		{ type: 'image', src: '/works/thesis/sketches.png'},
		{
			type: 'text',
			value: `The model runs offline on the local machine: the installation needs no network in the exhibition hall, and the visitor's sentence is not sent anywhere.` 
		},
	]
};
