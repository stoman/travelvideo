# Video

## Serve the files exactly as they are

**No encoding pipeline, no ffmpeg, no quality ladder, no manifest.** Copy the existing files
across and serve them from `/assets/videos/{filename}`.

Note the path change: production currently serves from `/assets/videos/max/`, where `max` was
meant to be one of several renditions. Since there is only ever one, the subdirectory is
dropped. Video file URLs are not preserved across the rewrite — unlike page URLs, they are
only referenced by the app itself, never linked externally.

Source characteristics:

| | |
|---|---|
| Coded resolution | 640×480, displayed as **853×480** (anamorphic, non-square pixels) |
| Codec | H.264 High profile, Level 3.0 |
| Frame rate | 25 fps |
| Bitrate | ~700 kbps |
| Clip size | 185 KB – 2.2 MB, averaging ~900 KB (~160 MB for all 177) |
| Duration | a few seconds each |
| Audio | **none — no audio track at all** |

Do not reintroduce any of the following — each was considered and rejected:

- **1080p/720p renditions** — the source is 480p, so upscaling adds bytes and no detail.
- **AV1/HEVC** — hours of CPU to save a fraction of 160 MB.
- **Runtime quality selection** — a 900 KB file arrives in under a second on 4G.
- **Anamorphic normalisation** — browsers honour the container's display aspect ratio
  correctly; leave it alone.

## Player

```html
<video src="/assets/videos/{filename}" muted playsinline preload="metadata"></video>
```

**Always `muted`.** The clips genuinely contain no audio track, which is confirmed above.
That means autoplay works unconditionally in every browser with no permission prompt, no user
gesture requirement, and no audio state to carry between clips. There must be **no unmute
control** — there is nothing to unmute.

`playsinline` is required or iOS Safari will take the video fullscreen on play.

Controls: show native controls on the single-video views (`/video/:id`), hide them during
trip and random playback where the experience is lean-back and chained. This matches current
behaviour.

## Chaining

### Trip playback (`/trip/:tripId/:videoId`)

On `ended`, navigate to the next video in the trip's ordered `videos` array. At the end of the
trip, navigate to `/trip/:tripId` (the overview) rather than stopping on a dead frame.

The view also offers explicit "previous / next video on trip" links and a "stop at this
video" action that drops the visitor onto `/video/:videoId`.

### Random playback (`/random/:videoId`)

On `ended`, pick a random video whose `peopleStart` equals the current video's `peopleEnd`,
and navigate to it. This preserves the people-chaining conceit across random cuts — see
[data-model.md](data-model.md).

If nothing matches, fall back to any random video rather than dead-ending.

## Prefetch

**This is the one real mobile optimisation worth building.** While a clip is playing, prefetch
the next one so the transition is seamless:

```html
<link rel="prefetch" as="video" href="...">
```

or an off-DOM `HTMLVideoElement` with `preload="auto"`.

Applies to trip playback (the next video is known) and, if a candidate is chosen ahead of
time, to random playback. At ~900 KB per clip this is cheap and removes the visible stall
between videos that a chained experience otherwise has.

Do not prefetch more than one clip ahead — visitors abandon trips midway and the data is
wasted.

## No poster frames

Decided: **there are none.** No thumbnail grid exists in the design — the video index is a
country-grouped text list and the map uses markers, neither of which needs a still image.
`preload="metadata"` gives the browser enough to show a first frame on detail views.

This also keeps ffmpeg out of the project entirely. Generating posters would be the single
remaining reason to need it.

## Storage — committed to git

Decided: the video files **live in the repo**, at `public/assets/videos/`. Remove
`public/assets/videos` from `.gitignore`.

~160 MB total with a 2.2 MB largest file — comfortably within GitHub's limits. The benefit is
that the repo becomes the complete site: clone, build, deploy, with nothing external to sync
and no separate backup to maintain.

**This is irreversible.** Git retains every version of every binary forever, so re-encoding
the archive later would permanently add its full size to history on top of what is already
there. Treat any future re-encode as a deliberate, rare decision rather than routine
maintenance.

Vite copies `public/` to `dist/` verbatim, so no build configuration is needed.
