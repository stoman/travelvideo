# Architecture

## Stack

| Layer | Choice |
|---|---|
| Language | TypeScript (compile-time only, no runtime cost) |
| Build | Vite |
| UI | None — DOM APIs and pure render functions |
| Routing | History API (`pushState` + `popstate`), hand-written |
| Data | Static JSON/TS modules bundled at build time |
| Map | MapLibre GL JS |
| Styling | Vanilla CSS |
| Tests | `node:test` |

**Dependency inventory** — the whole point of the rewrite:

- **Ships to the browser: one.** MapLibre GL JS.
- **Build-time only: two.** Vite, TypeScript. Neither leaves a runtime trace; the output is
  plain HTML/CSS/JS that keeps working if the toolchain disappears.
- **Tests: zero.** `node:test` is a built-in module of the Node runtime, not an npm package —
  no `package.json` entry, no version to bump, no transitive tree.

Do not add a UI framework, a router library, a test framework, a CSS framework, or a state
management library. If something seems to need one, that is a signal the design has drifted —
re-read this file before adding it.

## Why a client-rendered SPA

The site is served as a single `index.html` for every URL. Apache already does this via
`FallbackResource /index.html` in `public/.htaccess`; that line is kept unchanged.

The reason it is an SPA rather than a set of static pages is **the map**. A persistent
MapLibre instance that is never torn down can animate between video locations as the visitor
moves through a trip. With full page loads the map would re-initialise on every navigation
and the camera movement — the site's signature behaviour — would be lost.

Everything else about an SPA is a cost here, not a benefit, and is accepted deliberately:
no SEO story, no social link previews, JS required. See Non-goals in [README.md](README.md).

## Data loading

The entire dataset is small enough to ship with the application: 177 videos of metadata is
roughly 60 KB of JSON, about 15 KB gzipped. Import it as a module so Vite bundles it.

Consequences:

- Every route transition is instant with **zero network requests**.
- No loading states, no fetch error handling, no request waterfalls, no caching layer.
- No data store, no ORM, no reactivity system. Data is a frozen object graph built once at
  module load.

## Project layout

```
src/
  main.ts               entry point: boots router + map, renders first view
  router.ts             parseRoute(pathname) -> Route, navigate(), popstate handling
  data/
    videos.json         migrated fixtures (see data-model.md)
    trips.json
    index.ts            loads, validates, builds derived indices, exports typed API
    types.ts            Video, Trip, Route type definitions
  views/
    trips.ts            trip list
    trip-overview.ts    itinerary + route map
    trip-display.ts     video playback within a trip
    videos.ts           all videos grouped by country
    video-display.ts    single video
    map.ts              full-screen map view
    about.ts
  map/
    map.ts              MapLibre instance lifecycle, flyTo
    layers.ts           markers, clusters, trip route lines
    style.ts            custom style JSON over OpenFreeMap tiles
  video/
    player.ts           playback, chaining, prefetch
  analytics.ts          GA4 wrapper
  styles/
    *.css
index.html              the shell
public/
  assets/
    videos/             177 clips, normalised then committed (see video.md)
```

## Rendering model

**Views are pure functions: `(data) => string`.** They take plain data and return an HTML
string. They do not touch the DOM, hold state, or perform side effects.

The router swaps `main.innerHTML` with the returned string and then attaches any needed
event listeners. DOM mutation happens only at that boundary.

This is not stylistic. It is what makes the whole application testable with `node:test`
alone — no jsdom, no happy-dom, no browser automation. See [testing.md](testing.md).

**Escaping:** all content is authored by Stefan and committed to the repo, so it is trusted.
Still, route parameters come from the URL and must never be interpolated into HTML. Use
`textContent` or an escape helper for anything derived from `location`.

## Routing

All existing URLs are preserved. Years of links have been shared.

| URL | View | Notes |
|---|---|---|
| `/` | — | Redirect to `/trip` |
| `/about` | about | |
| `/trip` | trips | List of all trips |
| `/trip/:tripId` | trip-overview | Itinerary, day gaps, route map |
| `/trip/start/:tripId` | — | Redirect to first video of the trip |
| `/trip/:tripId/:videoId` | trip-display | Playback with prev/next chaining |
| `/video` | videos | All videos grouped by country |
| `/video/:videoId` | video-display | Single video with metadata |
| `/map` | map | Full-screen interactive map |
| `/random` | — | Redirect to a random video |
| `/random/:videoId` | random-display | Playback chained by people matching |

Note the ambiguity between `/trip/start/:tripId` and `/trip/:tripId` — `start` must be
matched first. Likewise `/trip/:tripId/:videoId` has two segments where `/trip/:tripId` has
one. A simple segment-count-plus-literal-prefix matcher handles all of these; a routing
library is not warranted.

Unknown routes render a not-found view. Do not redirect them silently.

**Navigation:** intercept clicks on internal `<a href>` elements, `pushState`, render.
Listen to `popstate` for back/forward. External links and modified clicks
(ctrl/cmd/middle-click) must fall through to default browser behaviour.

## Application state

There is almost none. What exists:

- Current route (derived from `location.pathname`, not stored separately).
- The MapLibre instance (a module-level singleton).
- The currently playing video element.

No global store. No observers. No reactivity. If state seems to be growing, stop and
reconsider — the site has no user input beyond navigation and playback.
