<script>
	// The last screen. Desktop is three columns — heading, the lists, the note.
	// Mobile drops the heading column and leads with the name instead, so the
	// screen still introduces itself once the header has shrunk to a tracker.
	import about from '$lib/content/about.json';
	import { site } from '$lib/content/site.js';

	// "2026-09-22" → "22-09-2026". Parsed by hand rather than through Date, so
	// it can't drift a day on a timezone boundary.
	const updated = $derived.by(() => {
		const parts = (about.thinking?.updated ?? '').split('-');
		return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : '';
	});

	const paragraphs = $derived((about.thinking?.paragraphs ?? []).filter(Boolean));

	// `pairs` entries render on two lines (what, then where); `lines` on one.
	/** @type {{ label: string, pairs: { what: string, where: string }[], lines: string[] }[]} */
	const sections = $derived([
		{ label: 'Previously', pairs: about.previously ?? [], lines: [] },
		{ label: 'Education', pairs: about.education ?? [], lines: [] },
		{ label: 'Skills', pairs: [], lines: about.skills ?? [] }
	]);
</script>

<div class="about">
	<div class="col heading">
		<h2 class="display">{about.heading}</h2>
		{#if about.resume?.href}
			<a class="resume subtitle" href={about.resume.href} target="_blank" rel="noopener">
				{about.resume.label}
			</a>
		{/if}
	</div>

	<div class="col lists">
		<!-- Mobile leads with the name; desktop already has it in the header. -->
		<div class="identity">
			<p class="display">{site.name}</p>
			<p class="tagline">{site.tagline}</p>
		</div>

		{#each sections as section (section.label)}
			{#if section.pairs.length || section.lines.length}
				<div class="field">
					<p class="label">{section.label}</p>
					<ul class:flat={section.lines.length}>
						{#each section.pairs as item (item.what + item.where)}
							<li><span>{item.what}</span><span>{item.where}</span></li>
						{/each}
						{#each section.lines as item (item)}<li>{item}</li>{/each}
					</ul>
				</div>
			{/if}
		{/each}

		{#if about.resume?.href}
			<a
				class="resume resume-mobile subtitle"
				href={about.resume.href}
				target="_blank"
				rel="noopener"
			>
				{about.resume.label}
			</a>
		{/if}
	</div>

	<div class="col note">
		{#if paragraphs.length}
			<div class="field">
				<p class="label">{about.thinking.label}</p>
				<div class="prose">
					{#each paragraphs as paragraph, i (i)}<p>{paragraph}</p>{/each}
				</div>
			</div>
		{/if}
		{#if updated}<p class="updated">Updated {updated}</p>{/if}
	</div>
</div>

<style>
	.about {
		display: grid;
		height: 100%;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		column-gap: 80px;
		align-items: center;
		padding: calc(var(--page-pad) + var(--header-h)) var(--page-pad) var(--page-pad);
	}
	.col {
		display: flex;
		flex-direction: column;
	}
	.lists {
		gap: 20px;
	}
	.note {
		gap: 20px;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.field ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	/* Each entry is two lines: what, then where. */
	.field li span {
		display: block;
	}
	.field ul.flat li {
		line-height: 22px;
	}
	.prose {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.updated {
		margin-top: 20px;
	}
	.tagline {
		font-size: var(--text-body);
		line-height: var(--leading-body);
	}
	/* The name and the second resume link belong to the mobile composition. */
	.identity,
	.resume-mobile {
		display: none;
	}

	@media (max-width: 767px) {
		.about {
			display: block;
			/* Long on a short phone, so let this one screen scroll inside itself
			   without handing the scroll back to the deck mid-list. */
			overflow-y: auto;
			overscroll-behavior: contain;
			padding: calc(var(--header-h) + 20px) var(--page-pad) var(--page-pad);
		}
		.heading,
		.note {
			display: none;
		}
		.identity {
			display: block;
			margin-bottom: 40px;
		}
		.resume-mobile {
			display: block;
			margin-top: 40px;
		}
		.lists {
			gap: 20px;
		}
	}
</style>
