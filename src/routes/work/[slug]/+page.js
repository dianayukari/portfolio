import { error } from '@sveltejs/kit';
import { works, bySlug } from '$lib/content/works/index.js';

// Tell the static adapter which slugs to prerender (one HTML file per work).
export function entries() {
	return works.map((w) => ({ slug: w.slug }));
}

export function load({ params }) {
	const work = bySlug[params.slug];
	if (!work) throw error(404, `Work "${params.slug}" not found`);
	return { work };
}

export const prerender = true;
