# Implementation Plan

Branch: `rewrite/vanilla-spa`. `main` stays deployable throughout — the live site keeps
running on Ember until the rewrite is genuinely finished.

**A half-finished rewrite is strictly worse than a working Ember app.** Sequence so that value
lands early and the project can be paused without leaving anything broken.

## Prerequisites

Two things are missing from the working copy and will block Phase 1 if not handled first.

**Node is not installed locally.** There is no `node`, `npm`, `python` or `ffmpeg` on the
machine — the current app is built entirely inside Docker (`danlynn/ember-cli`) and on CI
runners. Nothing in this plan can be run locally until that is resolved. Either install Node
24 (matching CI) or run the toolchain in a container. Decide before starting; a lot of the
work is iterative and a container round-trip per test run is painful.

**The video files are not in the repo or the working copy.** `public/assets/videos` does not
exist locally and is gitignored. Phase 1 commits ~160 MB of video, so they have to be
retrieved first. Production is the authoritative copy — the files served there are exactly the
ones that should be committed:

```
source:      https://travel.stoman.de/assets/videos/max/<filename>
destination: public/assets/videos/<filename>
```

The `max` segment is correct on the source URL and deliberately absent at the destination —
production kept it for renditions that were never built, and the rewrite drops it. See
[video.md](video.md).

Every `filename` is listed in the `FIXTURES` array in `app/models/video.js`, so extract the
177 names and fetch them. Check for a local archive first in case originals exist elsewhere,
but the production files are correct as-is and need no processing.

## Commit discipline

**Make a separate commit for every numbered step below.** Do not batch several steps into one
commit, and do not wait until the end of a phase.

Each message should say what changed and why. Steps are sized so that one commit each keeps
the history reviewable, makes a bad change easy to isolate, and lets the work be paused and
resumed without reconstructing intent. Push regularly so the pull request reflects real
progress rather than arriving as one large drop.

Where a step leaves tests failing or the build broken, say so in the commit message.

## Phase 0 — ship independently of the rewrite

Small, high-value, and benefits visitors whether or not the rewrite ever completes. These
belong on `main`, not on the rewrite branch.

1. Enable `mod_deflate` (and `mod_brotli`) in `docker-httpd.conf`.
2. Add `Cache-Control` headers to `public/.htaccess`.
3. Turn off `Options Indexes`.
4. Batch Renovate to monthly, or scope to security advisories, so the ~24 open dependency PRs
   stop being a standing chore during the rewrite.

## Phase 1 — data foundation

Nothing renders yet; this is the layer everything else reads.

1. Scaffold Vite + TypeScript. Confirm `npm run build` emits static files to `dist/`.
2. **Bring the videos into the repo.** Remove `public/assets/videos` from `.gitignore` and
   commit the ~160 MB archive to `public/assets/videos/`. Doing this first makes the
   "every filename exists" invariant enforceable from the start. This commit is irreversible —
   see [video.md](video.md).
3. Write the one-time migration script: `app/models/{video,trip}.js` FIXTURES →
   `src/data/{videos,trips}.json`. Drop the `all` trip; it becomes derived.
4. Define types, load the data, derive the `all` trip, and build the derived indices
   (`videoToTrips`, `videosByCountry`, day gaps, counts).
5. Write the content-invariant tests and run them against the migrated data. Expect
   people-chain violations in the historical data; report them as warnings for review rather
   than failing the build on day one.
6. Wire `npm test` to `node --test` and add `tsc --noEmit`.

**Exit criteria:** `node --test` passes against all 177 videos and 16 trips.

## Phase 2 — shell and routing

1. `index.html` shell: map container, content container, nav.
2. `parseRoute` covering every URL in the routing table, plus tests.
3. Link interception, `pushState`, `popstate`, not-found view.
4. The three redirects: `/` → `/trip`, `/trip/start/:id` → first video, `/random` → a random
   video.

**Exit criteria:** every URL resolves to a distinguishable placeholder; back/forward work.

## Phase 3 — views

Build as pure `(data) => string` functions, in rough order of dependency:

1. `/about` — simplest, and the copy needs rewriting anyway.
2. `/trip` and `/video` — list views, exercise the derived indices.
3. `/trip/:tripId` — itinerary with day gaps.
4. `/video/:videoId` — metadata plus trip membership.

**Exit criteria:** every view renders correct content, unstyled.

## Phase 4 — video playback

1. Player module: `muted`, `playsinline`, controls only on single-video views.
2. Trip chaining on `ended`, ending at the trip overview.
3. Random chaining via people matching, with the no-match fallback.
4. Next-clip prefetch.

**Exit criteria:** a full trip plays end to end on a phone without interaction.

## Phase 5 — map

The largest single piece, and the reason the rewrite is happening now.

1. MapLibre instance as a persistent singleton, loaded asynchronously.
2. Custom style over OpenFreeMap tiles; settle the warm palette.
3. Marker source with clustering; tap a marker to navigate, tap a cluster to zoom.
4. Trip route lines — home-anchored, loop closed when `finished`, `all` excluded.
5. `flyTo` on route change using `preferredZoom`; `prefers-reduced-motion` jumps instead.
6. Gesture handling: cooperative inside scrolling pages, full control on `/map`.

**Exit criteria:** `/map` is usable one-handed on a phone; the map animates between videos
during trip playback.

## Phase 6 — design

1. Base stylesheet: custom properties, paper texture, typography.
2. Stamp navigation — try the SVG-mask approach, fall back to the existing PNGs.
3. Mobile layout: stacked video → details → map, bottom stamp bar, `100dvh` flex column.
4. Desktop layout: full-bleed map, floating paper box, scattered stamps.
5. Focus states, contrast check, `prefers-reduced-motion`.

**Exit criteria:** verified on a real phone, not a narrow desktop window.

## Phase 7 — cutover

1. Adapt `Dockerfile` to the Node builder.
2. Repoint `lint.yml` at the new toolchain; add `needs` gating to `deploy.yml`.
3. Delete the Ember app: `app/`, `config/`, `tests/`, `ember-cli-build.js`, `testem.js`,
   `.ember-cli`, `.template-lintrc.js`, and the Ember dependencies.
4. Delete the dead Disqus config.
5. **Verify every preserved URL resolves**, ideally by crawling the live site's link graph
   before cutover and checking each path against the new build.
6. Merge to `main` and let the existing pipeline deploy.

**Rollback:** revert the merge commit; CI rebuilds and redeploys the Ember app. Keep the
pre-cutover commit tagged so this stays a one-step operation.

## Deliberately out of scope

Do not let these expand the project:

- SSR, prerendering, SEO or social link previews — see Non-goals.
- Any video transcoding.
- Self-hosted map tiles.
- A comment system.
- Multi-language support.
- A PWA/offline mode.
