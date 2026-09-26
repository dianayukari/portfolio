// -----------------------------------------------------------------------------
// SITE  —  the identity block that sits in the header on every screen after
// home, and in the middle of home itself.
// -----------------------------------------------------------------------------
export const site = {
	name: 'Diana Yukari',
	tagline: 'visual | narrative | data',
	// The statement on the right of the home screen.
	statement: 'Designing and building for complicated data',

	// Not surfaced anywhere in the current design — the about screen carries the
	// resume link instead. Kept here so they're one edit away if a contact line
	// comes back.
	links: [
		{ label: 'yukaridiana@gmail.com', href: 'mailto:yukaridiana@gmail.com' },
		{ label: 'Instagram', href: 'https://www.instagram.com/dianayukari' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/dianayukari/' }
	]
};

export default site;
