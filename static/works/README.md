# Work media

Drop each work's images and videos here, in a folder matching its `slug`.
These paths match the `src` values in `src/lib/content/works/*.js`.

```
static/works/
  thesis/              cover.jpg  01.jpg  02.jpg  03.jpg  04.jpg
  earthquake/          cover.jpg  01.jpg  02.jpg  03.jpg  04.jpg
  folha-printed/       cover.jpg  01.jpg … 06.jpg
  folha-interactive/   cover.jpg  01.jpg  01.mp4  02.jpg  03.jpg  03.mp4  04.jpg
  ts-data-analysis/    cover.jpg  chart-01.png  chart-02.png
```

Referenced with a leading `/` (e.g. `/works/thesis/cover.jpg`) — no `static/`
prefix. Until you add real files the pages still build; images just show blank.
```
