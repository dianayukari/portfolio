// -----------------------------------------------------------------------------
// WORK · CASE STUDY  (see thesis.js for the block reference)
// -----------------------------------------------------------------------------
export default {
	slug: 'beyond-borders-2026',
	title: 'Beyond Borders 2026',
	year: '2026',
	publication: 'EBANX',
	role: 'Data Visualization, Development',
	type: 'case-study',
	summary: `Data visualisation and generative identity for the seventh edition of EBANX's annual study of digital payments across Latin America, Africa and Asia`,
	cover: '/works/beyond-borders-2026/header.png',

	links: [{ label: 'View the report', href: 'https://www.ebanx.com/en/beyond-borders-2026/' }],

	blocks: [
		{
			type: 'text',
			value: `EBANX is a Brazilian payments company that processes cross-border payments for global businesses selling into emerging markets. Beyond Borders is its annual study of digital payments and e-commerce in those markets, published since 2019 and drawing on the company's own transaction data. The 2026 edition was published as a web report covering Latin America, Africa and Asia.`
		},
		{ type: 'heading', value: 'The orbit' },
		{
			type: 'text',
			value: `I started from the Global Findex figures on digital payment adoption and built a main visual element out of them: one circle per country, sized by the 2024 share of adults making or receiving digital payments, green where it had grown since 2021.`
		},
		{
			type: 'image',
			src: '/works/beyond-borders-2026/orbit.gif',
			caption: 'Data driven main visual element of the report'
		},
		{
			type: 'text',
			value: `The circles are displaced by a 3D Perlin noise field, written in p5. Perlin noise was developed for film in the early 1980s to generate natural-looking texture — clouds, terrain, smoke — and its defining property is coherence: neighbouring points receive similar values, so the field drifts as a whole rather than flickering point by point. Applied to the country circles it produced motion that reads as breathing.`
		},
		{
			type: 'text',
			value: `The report was subtitled The Local Pulse of Global Payments. The orbit set the visual language for the rest of the report, designed by EBANX's design team:`
		},
		{
			type: 'columns',
			items: [
				{
					type: 'image',
					src: '/works/beyond-borders-2026/home.png',
					caption: `Homepage: The report's home introduces the orbit. (produced by EBANX)`
				},
				{
					type: 'image',
					src: '/works/beyond-borders-2026/01.png',
					caption: 'Section headers: Every chapter opens on a crop of the orbit. (produced by EBANX)'
				}
			]
		},
		{
			type: 'columns',
			items: [
				{ type: 'image', src: '/works/beyond-borders-2026/linkedin1.jpg', caption: 'Social Media asset using the orbit (produced by EBANX)' },
				{ type: 'image', src: '/works/beyond-borders-2026/linkedin2.jpg', caption: 'Social Media asset using the orbit (produced by EBANX)' }
			]
		},
		{ type: 'heading', value: 'The charts' },
		{
			type: 'text',
			value: `I was also commissioned to design the report's custom charts, the ones that couldn't be built in Flourish, either because of the form or the interaction. EBANX supplied the data, mostly proprietary transaction data, with public sources including the World Bank. I designed them and built them in D3. These are some of the charts, with sample data.`
		},
		{
			type: 'chart',
			name: 'joyplot', // key in src/lib/charts/index.js — one module per chart
			span: 'wide',
			height: 400,
			props: { src: '/works/beyond-borders-2026/transactions_joyplot.csv' },
			caption: 'Share of Payments by Payment Method in Brazil'
		},
		{
			type: 'chart',
			name: 'vertical', // key in src/lib/charts/index.js — one module per chart
			span: 'wide',
			height: 250,
			props: { src: '/works/beyond-borders-2026/ecomm_verticals.csv' },
			caption: 'A2A Share by Vertical in E-commerce (%)'
		},
		{
			type: 'chart',
			name: 'b2b', // key in src/lib/charts/index.js — one module per chart
			span: 'wide',
			// No `height` — the small multiples size themselves from the row count.
			props: { src: '/works/beyond-borders-2026/pay_profile_br.csv' },
			caption: 'Share of Sales from Merchants Offering Three or More Payment Methods, by Vertical (%)'
		},
		{
			type: 'chart',
			name: 'circles', // key in src/lib/charts/index.js — one module per chart
			span: 'wide',
			height: 520,
			props: { src: '/works/beyond-borders-2026/market_vol.csv' },
			caption: 'B2B market per vertical (USD billion)'
		}
	]
};
