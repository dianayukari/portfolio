// -----------------------------------------------------------------------------
// DECK  —  which screen is showing, and where each project's gallery is.
//
// `index` uses the same numbering as the tracker: -1 is home (which has no
// square), 0…n-1 are the projects, n is about. The page doesn't scroll —
// goToScreen writes the index and the screens switch on it.
// -----------------------------------------------------------------------------

/** @type {{ index: number, gallery: number[], counts: number[], lightbox: boolean }} */
export const deck = $state({
	index: -1,
	/** desktop lightbox showing the active project's current slide */
	lightbox: false,
	/** current media index, one entry per project */
	gallery: [],
	/** media count, one entry per project — galleryStep wraps on these */
	counts: []
});

/** Called once by the page, before the screens render. */
/** @param {{ media?: unknown[] }[]} projects */
export function initGalleries(projects) {
	deck.gallery = projects.map(() => 0);
	deck.counts = projects.map((p) => p.media?.length ?? 0);
}

/** How many media items the screen currently showing has (0 on home/about). */
export function activeCount() {
	const i = deck.index;
	return i >= 0 && i < deck.counts.length ? deck.counts[i] : 0;
}

/** Step the active project's gallery, wrapping at both ends so neither
    chevron is ever dead. No-op unless a project with 2+ items is showing. */
/** @param {number} dir */
export function galleryStep(dir) {
	const i = deck.index;
	const n = activeCount();
	if (n < 2) return;
	deck.gallery[i] = (deck.gallery[i] + dir + n) % n;
}

/** Show screen `index`, clamped to home…about. Nothing scrolls: the screens
    are stacked and CSS swaps them, keyed off `deck.index`. */
/** @param {number} index */
export function goToScreen(index) {
	const next = Math.max(-1, Math.min(deck.counts.length, index));
	if (next === deck.index || deck.lightbox) return;
	deck.index = next;
	lockedUntil = performance.now() + LOCK;
}

// -----------------------------------------------------------------------------
// INPUT  —  wheel and swipe become one step per gesture.
//
// A trackpad fling keeps firing wheel events for a second or more, so after a
// switch the wheel is locked for LOCK ms and then until it has been quiet for
// QUIET ms — the tail of one fling can never turn into a second step. A mouse
// wheel's notches arrive further apart than QUIET, so it still steps on.
// Anything inside a screen that scrolls on its own (about on a phone, the
// project sheet) keeps the gesture until it hits its end. A sideways swipe
// pages the active project's gallery, like the ‹ › chevrons — except on the
// open project sheet, which covers the media.
// -----------------------------------------------------------------------------

const LOCK = 700;
const QUIET = 100;
const WHEEL_THRESHOLD = 40;
const SWIPE_THRESHOLD = 50;

let lockedUntil = 0;
let wheelTotal = 0;
let lastWheel = 0;

/** The nearest scrollable box between `target` and the deck, if any. */
/** @param {EventTarget | null} target */
function scroller(target) {
	for (let el = target instanceof Element ? target : null; el; el = el.parentElement) {
		if (el.classList.contains('deck')) return null;
		const { overflowY } = getComputedStyle(el);
		if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
			return el;
		}
	}
	return null;
}

/** Can `el` still scroll further in direction `dir` (1 down, -1 up)? */
/** @param {Element | null} el @param {number} dir */
function hasRoom(el, dir) {
	if (!el) return false;
	return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0;
}

/** @param {WheelEvent} event */
export function onDeckWheel(event) {
	if (deck.lightbox || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
	const dy = event.deltaY * (event.deltaMode === 1 ? 16 : 1);
	if (hasRoom(scroller(event.target), Math.sign(dy))) return;

	const now = performance.now();
	if (now < lockedUntil) {
		lockedUntil = Math.max(lockedUntil, now + QUIET);
		return;
	}
	if (now - lastWheel > 200) wheelTotal = 0;
	lastWheel = now;
	wheelTotal += dy;
	if (Math.abs(wheelTotal) >= WHEEL_THRESHOLD) {
		goToScreen(deck.index + Math.sign(wheelTotal));
		wheelTotal = 0;
	}
}

/** @type {{ x: number, y: number, box: Element | null, top: number, sheet: boolean } | null} */
let touch = null;

/** @param {TouchEvent} event */
export function onDeckTouchStart(event) {
	if (event.touches.length !== 1) return (touch = null);
	const t = event.touches[0];
	const box = scroller(event.target);
	const sheet = event.target instanceof Element && !!event.target.closest('.sheet');
	touch = { x: t.clientX, y: t.clientY, box, top: box?.scrollTop ?? 0, sheet };
}

/** @param {TouchEvent} event */
export function onDeckTouchEnd(event) {
	if (!touch) return;
	const t = event.changedTouches[0];
	const dx = touch.x - t.clientX;
	const dy = touch.y - t.clientY;
	const { box, top, sheet } = touch;
	touch = null;
	if (Math.abs(dx) > Math.abs(dy)) {
		if (Math.abs(dx) >= SWIPE_THRESHOLD && !sheet) galleryStep(Math.sign(dx));
		return;
	}
	if (Math.abs(dy) < SWIPE_THRESHOLD) return;
	// The gesture scrolled something inside the screen — it was for that.
	if (box && (box.scrollTop !== top || hasRoom(box, Math.sign(dy)))) return;
	goToScreen(deck.index + Math.sign(dy));
}
