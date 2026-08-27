// -----------------------------------------------------------------------------
// WORKS INDEX  —  order here controls the order on the homepage.
// To add/remove a work: create/delete its file and update this list.
// The dynamic route (work/[slug]) generates a page for every entry at build.
// -----------------------------------------------------------------------------
import thesis from './thesis.js';
import earthquake from './earthquake.js';
import folhaPrinted from './folha-printed.js';
import folhaInteractive from './folha-interactive.js';
import TsIpcc from './ts-ipcc.js';

export const works = [
	thesis,
	earthquake,
	folhaPrinted,
	folhaInteractive,
	TsIpcc
];

// Only internal works have a slug; external-link works are looked up by URL.
export const bySlug = Object.fromEntries(works.filter((w) => w.slug).map((w) => [w.slug, w]));

export default works;
