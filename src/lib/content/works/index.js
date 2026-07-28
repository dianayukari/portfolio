// -----------------------------------------------------------------------------
// WORKS INDEX  —  order here controls the order on the homepage.
// To add/remove a work: create/delete its file and update this list.
// The dynamic route (work/[slug]) generates a page for every entry at build.
// -----------------------------------------------------------------------------
import thesis from './thesis.js';
import earthquake from './earthquake.js';
import folhaPrinted from './folha-printed.js';
import folhaInteractive from './folha-interactive.js';
import tsDataAnalysis from './ts-data-analysis.js';

export const works = [thesis, earthquake, folhaPrinted, folhaInteractive, tsDataAnalysis];

export const bySlug = Object.fromEntries(works.map((w) => [w.slug, w]));

export default works;
