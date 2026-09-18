# Map

The map is the centrepiece of the site. It shows every video location and draws the route of
each trip.

## Library and tiles

**MapLibre GL JS** — open-source WebGL vector renderer. It is the one unavoidable runtime
dependency: it is framework-agnostic, standards-based, and replaces OpenLayers 10 with better
mobile gesture handling and GPU-rendered geometry.

**OpenFreeMap** for tiles — free, no API key, no account, no usage limits. Self-hosting was
rejected on disk: a z0–12 planet extract is 4–15 GB and the server has 22 GB free with the
video archive on the same filesystem.

OpenFreeMap is donation-funded and could disappear, but switching is a one-line change to the
style's tile source URL. Do not build abstractions to "support multiple providers" — a URL
swap is already the entire migration.

## Style

Tiles are served by OpenFreeMap but **styling is entirely client-side** — the style JSON
belongs to us, so the visual direction is unconstrained by the provider.

The original site used Stamen *watercolor* tiles (now behind a Stadia Maps key), which gave
it a hand-painted travel-journal character. The rewrite should evoke that with a warm, muted
custom palette rather than reproducing it literally.

**The specific palette is settled during implementation, not up front** — it is a design
decision best made by looking at real tiles on a real screen. Constraints: it must sit
comfortably beneath the amber/coral stamps and paper-texture boxes described in
[ui-design.md](ui-design.md), and the red trip routes (`#e74c3c`) must stay legible against
it. Expect to iterate.

## Instance lifecycle

**One MapLibre instance, created at boot, never destroyed.** This is the entire reason the
site is a single-page app — a persistent map can animate between video locations as the
visitor moves through a trip, which a multi-page site cannot do.

The map lives in a fixed container behind the content. Views do not create or own it; they
ask the map module to fly somewhere.

- `flyTo(lon, lat, zoom)` on entering a video route, using the video's `preferredZoom`.
- Zoom limits: **min 2, max 12** (matching current behaviour and OpenFreeMap's practical
  range).
- Initial view: Munich (`11.57, 48.13`) at zoom 4 — the existing default.
- Load the map **asynchronously** and render content first. MapLibre is ~200 KB gzipped and
  must not block first paint on mobile.

## Layers

### Video markers

A single GeoJSON source containing all 177 videos as points, with `id` and `name` in the
feature properties. Rendered as a symbol/circle layer.

**Do not use DOM overlays.** The current OpenLayers implementation creates a `div` per video
— 177 absolutely-positioned elements that the browser repositions on every frame of every pan.
That is the main reason the existing map feels sluggish. GeoJSON sources are rendered on the
GPU and handle this count trivially.

### Clustering

Enable MapLibre's built-in GeoJSON clustering (`cluster: true`). At world zoom, 177 markers
across Europe and Asia are an unreadable mess on a phone; clusters collapse them into counted
bubbles that split apart as the visitor zooms in.

- Cluster bubbles show the contained count.
- Tapping a cluster zooms to its bounds.
- Tapping an individual marker navigates to `/video/:id`.
- Tune `clusterRadius` so dense areas (Japan, New Zealand, Iceland) separate at a sensible
  zoom rather than staying clustered until z10.

### Trip routes

One `LineString` feature per trip, stroked in the site's existing red (`#e74c3c`), width ~5.

Two rules carried over from the current implementation and both deliberate:

1. **Every trip's route starts at home** — Munich, `11.500945, 48.144391`. The line runs
   home → first video → … → last video. This is why the routes visibly radiate from Bavaria.
2. **Finished trips close the loop** — if `trip.finished` is true, append the home coordinate
   again so the route returns home. Unfinished trips are left open-ended.

The `all` pseudo-trip should be excluded from route rendering, or its line would connect
every video on earth in one meaningless polyline.

## Views using the map

| View | Map behaviour |
|---|---|
| `/map` | Full-screen, all markers clustered, all trip routes, full pan/zoom/controls |
| `/trip/:tripId` | That trip's route only, fitted to its bounds (no interaction needed) |
| `/trip/:tripId/:videoId` | Flies to the current video at its `preferredZoom` |
| `/video/:videoId` | Flies to that video |
| `/random/:videoId` | Flies to that video |
| everything else | Remains as a background at whatever position it held |

The current app removes all controls and interactions outside `/map` and re-adds them on
entry. Preserve that idea — a background map that pans under the content while the visitor is
trying to scroll is hostile, particularly on touch. Outside `/map`, the map is decorative and
should not capture gestures.

## Mobile considerations

- The map is a real, interactive element on mobile and gets meaningful screen space — see the
  layout in [ui-design.md](ui-design.md).
- MapLibre handles pinch-zoom natively; do not intercept touch events.
- Set `cooperativeGestures` or equivalent where the map sits inside a scrolling page, so a
  one-finger drag scrolls the page rather than panning the map. Two-finger gestures pan/zoom.
  On `/map`, where the map is the whole screen, disable that and let it take all gestures.
- Keep an eye on WebGL battery cost; the map should not animate continuously when idle.
