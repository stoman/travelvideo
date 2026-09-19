# travel.stoman.de — Rewrite Specification

Complete design for rewriting travel.stoman.de from Ember to a dependency-minimal vanilla
TypeScript application. Written to be read cold.

## What the site is

A personal travel log by Stefan Toman and Anna. At most places they visit they film a short
clip holding a sign with the place name. The clips are deliberately edited so that **each
video starts with the same people visible that the previous one ended with**, chaining the
footage together across a trip. The site presents these clips on a world map, grouped into
trips, with the routes drawn between them.

Live at <https://travel.stoman.de>. Public repo at <https://github.com/stoman/travelvideo>.

## What is being replaced

| | |
|---|---|
| Framework | Ember CLI 6.11, ember-source 6.10, ember-data 5.8 / WarpDrive |
| Map | OpenLayers 10.8 |
| Tooling | ESLint 9, Prettier 3, stylelint, ember-template-lint, npm + lockfile |
| Dependencies | ~45 devDependencies, kept current by Renovate + Dependabot |
| CI/CD | `.github/workflows/{test,lint,deploy}.yml` — working, and reused |
| Content | **177 videos across 16 trips** |
| Analytics | GA4 (`G-V757JDJL11`) |

The existing app is maintained and current — it is not being replaced because it is broken.
It is being replaced because the framework does very little for a site with no forms, no user
input and static data; because Ember is used nowhere else in Stefan's work; and because the
mobile redesign is the same amount of work in either architecture, so doing it on the target
foundation avoids building it twice.

## Goals

- Work well on mobile. Most visitors watch on phones; the current app has **zero media
  queries**.
- Keep the map central — locations and trip routes are the point of the site.
- Minimise long-term maintenance: web standards over libraries, no UI framework.
- Preserve every existing URL so links shared over the years keep working.
- Preserve the people-chaining conceit that the whole video series is built around.

## Non-goals

- Server-side rendering, SEO, or social link previews. Shared links will show generic
  metadata; this is accepted.
- Comments. Never existed, not wanted.
- Video transcoding of any kind. See [video.md](video.md).
- Self-hosted map tiles. See [map.md](map.md).
- Poster frames or thumbnails.

## Decisions

Settled. Do not relitigate without a concrete reason.

| Decision | Rationale |
|---|---|
| Vanilla TypeScript, no UI framework | The app has almost no dynamic state; DOM APIs suffice |
| Vite + TypeScript as the only build deps | Output is plain static files with no runtime trace of the tool |
| MapLibre GL JS | The one runtime dependency; standards-based, framework-agnostic |
| OpenFreeMap hosted tiles | Self-hosting needs 4–15 GB; the server has 22 GB free and the videos live there too |
| Client-rendered SPA, one `index.html` | Keeps the map instance alive so it can animate between videos |
| One rendition, normalised once before the first commit | Sources range 320×240–1080p at wasteful bitrates; a single ffmpeg pass roughly halves permanent repo weight. A ladder still solves nothing |
| Video files committed to git | Makes the repo the complete site — clone, build, deploy |
| The `all` trip is derived, not stored | Removes 177 duplicated ids and cannot drift out of sync |
| No poster frames | No thumbnail grid in the design; avoids an ffmpeg dependency |
| Static data files in the repo | No backend, no CMS |
| `node:test` for tests | Built into Node; adds no dependency |
| Vanilla CSS | Custom properties, nesting and container queries cover everything needed |
| No background images anywhere | Stamps, paper texture and map marker all rendered in CSS; only the about-page photo survives |
| Keep GA4 | Already working |
| Preserve all existing URLs | Years of shared links |

The map palette is the one design decision left open, settled by eye during implementation —
see [map.md](map.md).

## Contents

| File | Covers |
|---|---|
| [architecture.md](architecture.md) | Stack, SPA shape, routing, project layout, rendering model |
| [data-model.md](data-model.md) | Schemas, migration from Ember fixtures, derived data, invariants |
| [map.md](map.md) | MapLibre setup, tiles, layers, clustering, interactions |
| [video.md](video.md) | Delivery, player behaviour, autoplay chaining, prefetch |
| [ui-design.md](ui-design.md) | Views, mobile and desktop layouts, stamps, CSS approach |
| [infrastructure.md](infrastructure.md) | Docker, Apache, CI/CD, analytics |
| [testing.md](testing.md) | `node:test` strategy and the content invariants |
| [implementation-plan.md](implementation-plan.md) | Phased sequencing and cutover |
