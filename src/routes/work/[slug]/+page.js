import { error } from '@sveltejs/kit';
import { works, bySlug } from '$lib/content/works/index.js';

// Tell the static adapter which slugs to prerender (one HTML file per work).
// External-link works (those with `href`) have no internal page, so skip them.
export function entries() {
	return works.filter((w) => w.slug && !w.href).map((w) => ({ slug: w.slug }));
}

export function load({ params }) {
	const work = bySlug[params.slug];
	if (!work || work.href) throw error(404, `Work "${params.slug}" not found`);
	return { work };
}

export const prerender = true;
