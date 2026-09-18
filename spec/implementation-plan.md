# Implementation Plan

Branch: `rewrite/vanilla-spa`. `main` stays deployable throughout — the live site keeps
running on Ember until the rewrite is genuinely finished.

**A half-finished rewrite is strictly worse than a working Ember app.** Sequence so that value
lands early and the project can be paused without leaving anything broken.

## Prerequisites

Two things are missing from the working copy and will block Phase 1 if not handled first.

**No local toolchain.** There is no `node`, `npm`, `python`, `ffmpeg` or `docker` on the
machine — the current app is built entirely on CI runners and in images. Nothing in this plan
can be run locally until that is resolved. Install **Node 24** (matching CI) and **ffmpeg**
(needed once, in Phase 1). `winget` is available. Decide before starting; the work is
iterative and a container round-trip per test run is painful.

**The videos are downloaded but not in place.** They sit at `videos/max/` in the repo root —
outside `.gitignore`, which only covers `public/assets/videos`, so `videos/` has been added to
`.git/info/exclude` to prevent an accidental 200 MB commit. Remove that line once the files
have moved to their final location.

The directory holds **182 files**. All 177 referenced by the fixtures are present; the other
five are orphans that must **not** be committed:

```
bartolome_lang.mp4   hobbinton.mp4   peking2.mp4   test.mp4   zhangjiajie.mp4
```

`hobbinton.mp4` is a typo duplicate of `hobbiton.mp4`, which also exists and is the referenced
one. The rest are superseded alternates and a test file, 4.7 MB in total.

Build the list to keep from the `filename` values in the `FIXTURES` array in
`app/models/video.js` rather than from the directory listing, and the orphans drop out
naturally.

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
2. **Normalise the videos.** Run the ffmpeg pass from [video.md](video.md) over the 177
   referenced files in `videos/max/`, writing to `public/assets/videos/`. Skip the five
   orphans. Verify every output opens, matches its source duration and is smaller before
   going further; keep the originals until you have.
3. **Commit the normalised archive.** Remove `public/assets/videos` from `.gitignore`, drop
   the `videos/` line from `.git/info/exclude`, and commit. Doing this before the data work
   makes the "every filename exists" invariant enforceable from the start. **This commit is
   irreversible** — see [video.md](video.md).
4. **Write `docs/adding-videos.md`** — human-facing, for the next time a trip is added, while
   the process is fresh. It must cover: the exact ffmpeg invocation and what each flag does;
   the file naming convention; where files go; how to add entries to `videos.json` and
   `trips.json`; how to find coordinates and choose a `preferredZoom`; the people-chaining
   rule that `peopleEnd` of one clip must equal `peopleStart` of the next; running the
   invariant tests before committing; and a warning that committing video is permanent, so
   files should be normalised once and correctly rather than fixed up later.
5. Write the one-time migration script: `app/models/{video,trip}.js` FIXTURES →
   `src/data/{videos,trips}.json`. Drop the `all` trip; it becomes derived.
6. Define types, load the data, derive the `all` trip, and build the derived indices
   (`videoToTrips`, `videosByCountry`, day gaps, counts).
7. Write the content-invariant tests and run them against the migrated data. Expect
   people-chain violations in the historical data; report them as warnings for review rather
   than failing the build on day one.
8. Wire `npm test` to `node --test` and add `tsc --noEmit`.

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
2. Stamp navigation in pure CSS — perforated silhouette via composited radial-gradient masks,
   colour and rotation cycled with `:nth-child`. Delete `stamp1.png`–`stamp5.png`.
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
5. **Write `CLAUDE.md`** — agent-facing instructions for whoever works on this repo next,
   reflecting the finished structure rather than the rewrite. It must cover:
   - **Constraints that are easy to violate by habit:** no UI framework, no router library, no
     test framework, no CSS framework, no state library. One runtime dependency (MapLibre),
     two build dependencies (Vite, TypeScript). Adding any dependency needs a reason.
   - **Conventions:** views are pure `(data) => string` functions with DOM mutation confined
     to the router; vanilla CSS with custom properties; one commit per logical change.
   - **Where things live:** `src/data/` for content, `public/assets/videos/` for media,
     `spec/` for the original design rationale.
   - **Adding content:** point at `docs/adding-videos.md` rather than duplicating it.
   - **Inspecting and repairing media**, which is the procedure most likely to be needed and
     least likely to be guessed: how to read an MP4's resolution, duration and audio presence
     by parsing container boxes (`tkhd` for display dimensions at offset +80/+84, `mvhd` for
     timescale and duration, absence of `mp4a` for silence) when ffmpeg is not installed; the
     normalisation command from [video.md](video.md); and how to diff the files on disk
     against the `filename` values in `src/data/videos.json` to find missing files and
     orphans. Note that sampling one file is not enough — this archive ranges from 320×240 to
     1920×1080 and a single sample misled the original analysis.
   - **Validation:** `npm test` runs the content invariants; run it before committing data.
6. **Verify every preserved URL resolves**, ideally by crawling the live site's link graph
   before cutover and checking each path against the new build.
7. Merge to `main` and let the existing pipeline deploy.

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
