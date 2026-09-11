// -----------------------------------------------------------------------------
// SITE  —  global info shown in the header, homepage intro and footer.
// -----------------------------------------------------------------------------
export const site = {
	name: 'Diana Yukari', 
	role: 'Information Designer',
	// The opening lines, set at body size.
	intro: [
		'Information designer working with data-first products'
	],
	// The longer background, set smaller and quieter beneath the intro above.
	// Same format: one string per paragraph, inline HTML allowed.
	introSecondary: [
		`Brazilian based in the Netherlands.`,
		`Previously Folha de S.Paulo, Rede Globo, Business Insider`
		// `I spent five years at <a href="https://www.folha.uol.com.br/" target="_blank" rel="noopener">Folha de S.Paulo</a>, Brazil's largest newspaper. R was the first thing I picked up there because I wanted to do more than the design of my projects. JavaScript came after, once I wanted people to explore my findings. I'm a learner at heart and pick up tools as I go. Before that I designed infographics for <a href="https://g1.globo.com/" target="_blank" rel="noopener">Rede Globo</a>, in São Paulo, and <a href="https://www.businessinsider.com/" target="_blank" rel="noopener">Business Insider</a>, in New York.`,
		// `I studied fine arts at <a href="https://www.saic.edu/" target="_blank" rel="noopener">SAIC</a> in Chicago, and later did a master in information design at <a href="https://www.designacademy.nl/" target="_blank" rel="noopener">DAE</a>, in Eindhoven, where the work leaned heavily on linguistics.`,
		// `I'm drawn to projects where good information changes what someone can actually do: public health, housing, education, the environment. I live with two cats, Tom and Papaia.`,
		// `You can reach me at <a href="mailto:yukaridiana@gmail.com" target="_blank" rel="noopener">yukaridiana@gmail.com</a>, or find me on <a href="https://www.instagram.com/dianayukari" target="_blank" rel="noopener">Instagram</a> and <a href="https://www.linkedin.com/in/dianayukari/" target="_blank" rel="noopener">LinkedIn</a>.`
	],
	// Contact / external links (shown on homepage + footer).
	links: [
		{ label: 'yukaridiana@gmail.com', href: 'mailto:yukaridiana@gmail.com' },
		{ label: 'Instagram', href: 'https://www.instagram.com/dianayukari' }, 
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/dianayukari/' } 
	],
	// Footer note.
	footer: '© ' + '2026' + ' Diana Yukari'
};

export default site;
