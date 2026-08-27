// Turn a heading string into a stable anchor id (used by both BlockRenderer,
// which puts the id on the <h2>, and the TOC, which links to it).
export function slugify(s) {
	return String(s)
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '') // strip accents
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
