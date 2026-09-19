# AGENTS.md

Agent-facing instructions for working on travel.stoman.de — a personal travel log by Stefan
Toman and Anna. At most places they visit they film a short clip holding a sign with the place
name, edited so each video starts with the same people visible that the previous one ended
with; the site presents these on a world map, grouped into trips, with routes drawn between
them. This file is about the finished structure, not how it got here — the rewrite from Ember
to this vanilla TypeScript SPA is done, and its planning documents (once in `spec/`) have been
retired; what's still actionable from them is folded in below and into README.md.

## Why an SPA, and why MapLibre

The site is one `index.html` for every route (`public/.htaccess`'s `FallbackResource`), not a
set of static pages, because of the map: a single MapLibre instance, created once and never
torn down, can animate the camera between video locations as the visitor moves through a trip.
A multi-page site would re-initialise the map on every navigation and lose exactly the
animation that makes the site distinctive. Everything else an SPA costs (no SEO, no social link
previews, JS required) is accepted deliberately — this site has no content anyone needs to
reach via a search result, and every visitor already has a modern browser.

MapLibre GL JS is the one runtime dependency because it renders 177 markers and trip routes on
the GPU from a single GeoJSON source, rather than one absolutely-positioned DOM element per
marker (the previous OpenLayers implementation's approach, and the main reason it felt
sluggish). Tiles come from OpenFreeMap — free, no API key, no usage limits; self-hosting was
rejected because a usable planet extract is several GB and the server's disk is shared with the
video archive. Switching tile providers is a one-line change to the style's source URL; don't
build abstractions to "support multiple providers" pre-emptively.

## Constraints — easy to violate by habit

This is a dependency-minimal site on purpose. Before reaching for a library, re-read this list.

- **No UI framework.** Views are plain functions returning HTML strings; the DOM is touched
  only at the boundary described below.
- **No router library.** `src/router.ts` is a hand-written `parseRoute(pathname) -> Route` plus
  `pushState`/`popstate` wiring. It covers exactly the URLs in the routing table and nothing
  else.
- **No test framework.** `node:test` and `node:assert` are built into the Node runtime used to
  build the site anyway — no new dependency, no version to bump.
- **No CSS framework.** Vanilla CSS: custom properties, native nesting where used, container
  queries where appropriate. No Tailwind, no Sass, no CSS-in-JS.
- **No state management library.** There is almost no application state: the current route
  (derived from `location.pathname`), the persistent MapLibre instance, and the currently
  playing `<video>` element. If state seems to be growing, that's a signal to stop and
  reconsider, not to reach for a store.
- **Deliberately out of scope** — don't let a reasonable-sounding request quietly expand into
  one of these; flag it instead: server-side rendering or prerendering, a comment system,
  multi-language support, a PWA/offline mode, video transcoding as a build step (normalisation
  is a one-off manual command, see below), self-hosted map tiles, poster frames/thumbnails.

**Dependency inventory:**

- **Ships to the browser: one runtime dependency.** MapLibre GL JS (`src/map/`). Everything
  else in `dependencies`/`devDependencies` is either build tooling or dev-only linting/
  formatting and leaves no trace in `dist/`.
- **Builds the site: two.** Vite and TypeScript. `npm run build` is `vite build`; TypeScript is
  compile-time only (`tsc --noEmit` in `npm test`, not part of the Vite build itself — Vite
  strips types without type-checking).
- **Lints/formats it: ESLint (+ typescript-eslint, eslint-config-prettier) and Prettier.**
  Dev-only, no effect on what ships. `@types/node` and `@types/geojson` are type-only too, for
  the same reason `node:fs`/GeoJSON literals type-check in editors and `tsc`.

Adding any new dependency needs a real reason, not convenience. If something seems to need a
library, that's usually a sign the design has drifted — re-read this section before adding one.

## Conventions

- **Views are pure `(data) => string` functions** (`src/views/*.ts`). They take already-resolved
  data — a `Video`, a `Trip`, a list — and return an HTML string. They don't touch the DOM,
  hold state, or perform side effects, which is what makes them testable with `node:test` alone.
- **DOM mutation is confined to `src/main.ts`** (and the small DOM-touching corners of
  `src/router.ts` and `src/map/*.ts`, `src/video/player.ts` that genuinely need it — link
  interception, the MapLibre instance, attaching a video's `ended` listener). `main.ts`'s
  `render(route)` looks up the data a route needs, calls the matching view, and sets
  `content.innerHTML`. Don't reach into the DOM from inside a view function.
- **Route params come from the URL and are untrusted** — set them via `textContent`, never
  interpolate them into an HTML string. Everything else (video/trip names, descriptions) is
  authored by Stefan and committed to the repo, so it's trusted and can be interpolated
  directly. See any view for the pattern.
- **Vanilla CSS with custom properties** (`src/styles/`), one file per concern (`base.css`,
  `nav.css`, `layout.css`) rather than one file per view — most views share the same handful of
  layout/paper-box rules, and splitting further would mean repeating them.
- **One commit per logical change.** Prefer a sequence of small, reviewable commits over one
  large one, especially for anything touching `public/assets/videos/` — see below.
- **Accessibility baseline.** Real `<a href>` elements for navigation, not click handlers on
  non-interactive elements. Visible focus states (`:focus-visible`, see `--focus-ring` in
  `base.css` — deliberately not one of the pastel stamp colors, which don't have enough contrast
  against the paper background to work as an outline). Check contrast for black text whenever a
  stamp/background color changes. Respect `prefers-reduced-motion`: the map jumps instead of
  flying, per `src/map/map.ts`'s `prefersReducedMotion()`.

## Where things live

- **`src/data/`** — `videos.json`/`trips.json` (content), `types.ts` (the `Video`/`Trip`/`Route`
  shapes), `index.ts` (loads the JSON, derives the `all` trip and the indices used across
  views: `videoToTrips`, `videosByCountry`, day gaps, counts).
- **`public/assets/videos/`** — the 177 normalised clips, committed to git. Adding one is
  **permanent** — see below.
- **`docs/adding-videos.md`** — the human procedure for adding a trip or video. Don't duplicate
  it here; point people at it.

## Adding content

See `docs/adding-videos.md` for the full procedure (ffmpeg invocation, the exact JSON shape,
finding coordinates, the people-chaining rule). The short version: normalise the clip once and
correctly (committing it is irreversible), add entries to `videos.json`/`trips.json`, run
`npm test` before committing.

## Inspecting and repairing media

The procedure most likely to be needed here and least likely to be guessed correctly: figuring
out what's actually in a video file when `ffmpeg`/`ffprobe` aren't installed on the machine
you're on.

### Reading an MP4's resolution, duration, and audio presence from raw bytes

MP4 is a box-based container (ISO/IEC 14496-12). Every box starts with `size` (4 bytes,
big-endian) then a 4-byte ASCII type; walk the file by reading a box's size, jumping that many
bytes to reach the next sibling. The boxes that matter here nest as `moov > trak > tkhd` (per
track) and `moov > mvhd` (whole file). This project's clips all use version-0 boxes (32-bit
fields); a version-1 box uses 64-bit time fields and shifts everything after them by 8 bytes —
check the version byte (the byte right after the 4-byte box type) before trusting these offsets.

**Display width/height** — from the start of a version-0 `tkhd` box (i.e. from its `size`
field, not its content): width is a big-endian `uint32` at byte offset **+84**, height at
**+88**, both as 16.16 fixed-point (divide by 65536 for the pixel value). Verified against
`abisko.mp4` (known 320×240): reading those offsets gives exactly 320 and 240.

```js
const fs = require('fs');
const buf = fs.readFileSync('public/assets/videos/some_clip.mp4');

function findBox(buf, type, start, end) {
  let offset = start;
  while (offset < end) {
    const size = buf.readUInt32BE(offset);
    const boxType = buf.toString('ascii', offset + 4, offset + 8);
    if (boxType === type) return { offset, size };
    if (size === 0) break;
    offset += size;
  }
  return null;
}

const moov = findBox(buf, 'moov', 0, buf.length);
const trak = findBox(buf, 'trak', moov.offset + 8, moov.offset + moov.size);
const tkhd = findBox(buf, 'tkhd', trak.offset + 8, trak.offset + trak.size);
const width = buf.readUInt32BE(tkhd.offset + 84) / 65536;
const height = buf.readUInt32BE(tkhd.offset + 88) / 65536;
```

**Duration** — from a version-0 `mvhd` box (`moov > mvhd`, only one per file): `timescale` is a
`uint32` at box offset **+20**, `duration` (in timescale units, not seconds) at **+24**.
Duration in seconds is `duration / timescale`.

**Silence** — every clip in this archive is silent by convention (the normalisation strips
audio; see `docs/adding-videos.md`). To confirm a specific file has no audio track, search the
`moov` box's bytes for the ASCII strings `mp4a` (the AAC audio sample entry) or `soun` (the
audio handler type in `hdlr`). Their absence means no audio track; `vide` will still be present
for the video track.

**Don't trust a single sample.** This archive genuinely ranges from 320×240 to 1920×1080, and
roughly three-quarters of it is anamorphic (640×480 coded with a 4:3 pixel aspect ratio,
displaying as 853×480) — a single file sampled to characterize "the" resolution or aspect ratio
of the archive was wrong twice during the rewrite for exactly this reason. Check several files,
and prefer the coded-box math above (or `ffprobe`, when available) over assumption.

### Normalisation command

If a clip genuinely needs re-encoding (rare — only ever a deliberate, one-off decision, never
routine maintenance), the command and the reasoning behind each flag are in
[`docs/adding-videos.md`](docs/adding-videos.md). Don't re-derive it from scratch; it explains
exactly why the filter is two `scale` stages rather than one (anamorphic sources need their
pixel aspect ratio corrected before the resolution cap, or the result is silently the wrong
aspect ratio).

### Finding missing files and orphans

Every `filename` in `src/data/videos.json` should resolve to a real file in
`public/assets/videos/`, and every file there should be referenced by at least one video
entry. To check both directions:

```bash
node -e "
const fs = require('fs');
const videos = JSON.parse(fs.readFileSync('src/data/videos.json', 'utf8'));
const referenced = new Set(videos.map(v => v.filename));
const onDisk = new Set(fs.readdirSync('public/assets/videos'));
console.log('Missing (referenced but not on disk):', [...referenced].filter(f => !onDisk.has(f)));
console.log('Orphaned (on disk but not referenced):', [...onDisk].filter(f => !referenced.has(f)));
"
```

`npm test`'s invariant suite (`src/data/invariants.test.ts`) already checks the "missing" case
on every run; this is for the reverse direction, which isn't currently a hard failure.

## Validation

```bash
npm test
```

Runs `tsc --noEmit` and the content-invariant suite against the real data — unique ids, every
referenced video/trip existing, valid coordinates, valid zoom levels, non-decreasing dates,
existing filenames, and the people-chain rule. Run it before committing any change to
`src/data/*.json`; it's the cheapest way to catch a typo before it reaches the live site
instead of 404ing there. A handful of pre-existing data issues are tracked as known exceptions
(reported as warnings, not failures) inside that file — grep it for `KNOWN_` before assuming a
new failure is one of them.

**What's deliberately not covered by `node:test`: whether MapLibre visually draws anything.**
That needs a real browser with WebGL, i.e. Playwright — a browser-automation dependency for
essentially one assertion, not worth it by this project's standards. Everything that _feeds_
the map (GeoJSON construction, coordinate validity, cluster config, `flyTo` parameters) is
tested without a browser; whether it actually renders correctly is verified by looking at the
site, on a real phone, not just a narrow desktop window.
