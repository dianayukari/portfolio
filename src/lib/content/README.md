# Content

Two JSON files drive the whole site. JSON can't carry comments, so the field
reference lives here.

## `projects.json`

An array. **Order is the order on the site**, and the `(01)`–`(05)` numbering is
the array index — it isn't stored, so it can't drift. Add or remove an entry and
the tracker in the header grows or shrinks to match.

| field         | type     | where it shows                                                                           |
| ------------- | -------- | ---------------------------------------------------------------------------------------- |
| `slug`        | string   | not visible — the screen's anchor (`#work-colors`)                                       |
| `title`       | string   | large bold line, left column (desktop) / in the sheet (mobile)                           |
| `subtitle`    | string   | light line under the title, e.g. `"EBANX, 2026"`                                         |
| `disciplines` | string[] | mobile only — joined with `·` as the eyebrow above the title                             |
| `description` | string   | right column, under `DESCRIPTION`                                                        |
| `role`        | string[] | right column, under `ROLE`, one per line                                                 |
| `solution`    | string   | right column under `SOLUTION`; also the body text in the mobile sheet                    |
| `focus`       | string[] | right column, under `FOCUS`, one per line                                                |
| `liveUrl`     | string   | `SEE LIVE ↗` on desktop; makes the media card tappable on mobile. Empty string hides it. |
| `media`       | object[] | the gallery — see below                                                                  |

Any text field left as `""` is skipped entirely, label and all, so a
half-filled project still renders cleanly.

### `media`

The gallery the chevrons page through. Any length; mixed types are fine.
One item hides the chevrons, zero items renders the empty device frame.

```json
{ "type": "image", "src": "/works/colors/map.png", "alt": "" }

{ "type": "video", "src": "/works/colors/walkthrough.mp4",
  "poster": "/works/colors/walkthrough.jpg", "frame": "phone", "alt": "" }
```

- `src` is a path inside `static/`, so `/works/…` — not `static/works/…`.
- Videos play muted, looped and inline, and only while their slide is the
  active one. `poster` is what shows on the other slides; without one the slide
  is blank until you step to it.
- Use `.mp4` (h.264) or `.webm`. `.mov` won't decode outside Safari.
- `alt` is for screen readers. Leave `""` for purely decorative media.
- `frame` puts the slide in a frame. Two kinds:
  - `"phone"` — a dark bezel, media filling it edge to edge.
  - `"window"` — a minimal macOS-style title bar sitting on top of the image,
    rounded corners, three dots. Sizes to the slot's width and shrink-wraps in
    height, so the bar is always exactly as wide as the image.

  Both are desktop-only: on mobile the screen is already the frame, so a framed
  slide falls back to the bare treatment.
  Leave `frame` out and the slide sits bare on the pink, shown whole.
  The window keeps each image's own aspect ratio, so nothing is cropped — drop
  in a screenshot of any shape. Sizes live in `src/app.css`: `--phone-height`
  and `--window-bar`.

The seeded paths point at files already in `static/works/` so every screen has
something to show. They are placeholders — drop final files into
`static/works/<slug>/` and repoint `src`.

## `about.json`

| field                          | shows as                                                        |
| ------------------------------ | --------------------------------------------------------------- |
| `heading`                      | the big `About` on the left                                     |
| `resume.label` / `resume.href` | the link under it. Put the PDF in `static/`.                    |
| `previously`                   | `PREVIOUSLY` list. Each `{ what, where }` renders on two lines. |
| `education`                    | `EDUCATION` list, same shape                                    |
| `skills`                       | `SKILLS` list, one string per line                              |
| `thinking.label`               | the column heading, right side                                  |
| `thinking.updated`             | ISO date `YYYY-MM-DD`, rendered as `Updated 22-09-2026`         |
| `thinking.paragraphs`          | the copy, one string per paragraph                              |
