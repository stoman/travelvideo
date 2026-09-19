# Video

## One rendition, normalised once before the first commit

Videos are served from `/assets/videos/{filename}` — a single file per video, no ladder, no
runtime selection.

Note the path change: production serves from `/assets/videos/max/`, where `max` was meant to
be one of several renditions that were never built. The subdirectory is dropped. Video file
URLs are therefore not preserved across the rewrite — unlike page URLs, they are only
referenced by the app itself, never linked externally.

### What the archive actually contains

177 referenced files, **194.8 MB**, mean 1.10 MB, largest 8.5 MB. Every clip is a few seconds
long and **silent** — no audio track anywhere. Resolutions are not uniform, and — corrected
after probing every file's actual stream data rather than the displayed size — **most of the
archive is anamorphic**, not native widescreen:

| Coded size | Sample aspect ratio | Displays as | Files | Size | Share |
|---|---|---|---|---|---|---|
| 640×480 | 4:3 (anamorphic) | 853×480 | 131 | 144.2 MB | 74% |
| 1920×1080 | 1:1 | 1920×1080 | 5 | 28.1 MB | 14% |
| 320×240 | 1:1 | 320×240 | 40 | 21.4 MB | 11% |
| 640×480 | 1:1 (not anamorphic) | 640×480 | 1 | 1.2 MB | 0.6% |

The earlier version of this table had it backwards: it treated the 131-file bucket as native
853×480 and called out a single file as "the anamorphic one" — which is actually the one file
in the archive that is *not* anamorphic. 131 files (74%) carry a 4:3 pixel aspect ratio on
640×480 coded video, stretching them to a 16:9-looking 853×480 on playback. Any ffmpeg filter
that scales by display size must account for this on nearly three-quarters of the archive, not
treat it as a one-off.

Bitrates are far higher than the content needs — the 1080p clips run at 6,670–8,510 kbps, and
the anamorphic bulk sits around 2,300 kbps where roughly 1,000 would look identical.

### Normalise before committing, not after

**Run one ffmpeg pass over the archive and commit the output**, not the originals. Actual
result: **141 MB**, down from 194.8 MB, with no visible quality loss — a smaller reduction than
first estimated. The original 80–110 MB target assumed only one file needed the anamorphic
pixel-count correction; correcting it on the real 131 means encoding 33% more pixels for 74% of
the archive, which claws back a good part of the CRF21 saving. 141 MB is still a 28% cut and
comfortably inside both GitHub's limits and the 22 GB disk budget, so this was not worth chasing
further with a more aggressive CRF.

This is the only cheap moment to do it. The files are going into git permanently, and
re-encoding later does not replace those bytes — it adds the new ones on top, forever.

It does not resurrect the pipeline: ffmpeg is a **one-time manual tool here**, run once with
its output committed. It is not a build step, not in CI, and not a maintenance burden.

```
ffmpeg -i <src> \
  -vf "scale=iw*sar:ih:flags=lanczos,setsar=1,scale='trunc(min(1280,iw)/2)*2':-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf 21 \
  -pix_fmt yuv420p -profile:v high \
  -an -movflags +faststart \
  <dst>
```

This is a two-stage scale, not one. A single `scale='min(1280,iw*sar)':-2` (the original draft
of this command) is wrong on the 131 anamorphic files: `iw*sar` for 640×480 at SAR 4:3 is
853.33, truncated to the odd number 853, which libx264 rejects outright
(`width not divisible by 2`). Worse, even if it didn't error, `scale`'s `-2` computes the free
dimension from the filter's *current* width/height ratio, which at that point is still the
un-corrected 640:480 — so the result would be 853×640, silently stretched to the wrong aspect
ratio. Fixing this needed two passes: undo the anamorphic squeeze first, *then* cap and encode.

Why each flag:

- **Stage one**, `scale=iw*sar:ih`, physically resizes to display width using the sample aspect
  ratio, un-squeezing the 131 anamorphic files (640×480 SAR 4:3 → 853×480). `setsar=1` records
  that the pixels are now square, so nothing downstream reapplies the correction.
- **Stage two**, `scale='trunc(min(1280,iw)/2)*2':-2`, caps at 720p and **never upscales** — the
  320×240 clips stay 320×240, since there is no detail to invent. `trunc(.../2)*2` forces the
  target width to an even number (needed for 4:2:0 chroma subsampling); `-2` computes the height
  from the now-correct square-pixel aspect ratio and rounds it to even too. For files that were
  never anamorphic (320×240, 1920×1080, and the one true 640×480 clip) stage one is a no-op
  since their SAR is already 1:1, so this behaves exactly like the original single-stage filter
  for them.
- `-crf 21` is deliberately conservative. These are already lossy, so re-encoding loses a
  little; 21 keeps that invisible while still cutting bitrate by more than half.
- `-preset slow` buys meaningful compression for a few seconds of clip each.
- `-an` strips audio tracks that carry nothing.
- `+faststart` moves the moov atom to the front so playback begins before the file finishes
  downloading. The originals do not all have this.

Verified over all 177 files: every output opens, and duration matches its source to within
1 ms. 135 of 177 (76%) also come out smaller, e.g. the 1920×1080 `bryce_canyon.mp4` → 1280×720,
8.1 MB → 1.6 MB.

**42 anamorphic files come out *larger* than their source, and that is expected, not a bug.**
These are the low-bitrate end of the 131 anamorphic files — originals that were already encoded
efficiently at their squeezed 640×480 coded size. Correcting the aspect ratio to the real
852×480 display size means encoding 33% more pixels; at a fixed CRF that costs more bits than
the original spent on fewer, squeezed pixels. Confirmed on `arezzo.mp4`: 640×480 source
(924 kbps) → 852×480 output (1,196 kbps), 636 KB → 822 KB — same duration, correct proportions,
no visible quality loss, just an unavoidably larger file because it is honestly representing
more pixels than the original did. Chasing "smaller" on these specific files would mean
either re-squeezing them (reintroducing the bug) or dropping resolution below what the source
actually contains.

**Verify before committing and keep the originals until you have:** every output must open and
match its source duration; treat "not smaller" as expected only for anamorphic files where the
corrected pixel count exceeds the squeezed original, and investigate any other file that grows.
Spot-check by eye: extract a frame from source and output with `ffmpeg -ss 1 -i <file> -frames:v
1 out.png` and compare — confirms proportions and quality without needing a video player. Cover
at least one file from each bucket (853×480 anamorphic, 1920×1080, 320×240) plus one from the
NOT_SMALLER group.

### Do not reintroduce

- **Multiple renditions** — one file per video. Runtime quality selection solves a bandwidth
  problem that ~1 MB clips do not have.
- **AV1/HEVC** — hours of CPU to save a fraction of an already-small archive.
- **A build-step or CI encoding pipeline** — the normalisation is a one-off.

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

**141 MB** after normalisation, down from 194.8 MB (see above for why this landed higher than
the original 80–110 MB estimate), with the largest source file 8.5 MB — well within GitHub's
limits either way. The benefit is that the repo becomes the
complete site: clone, build, deploy, with nothing external to sync and no separate backup to
maintain.

**This is irreversible.** Git retains every version of every binary forever, so re-encoding
the archive later would permanently add its full size to history on top of what is already
there. That is precisely why normalisation happens *before* the first commit, and why any
future re-encode should be a deliberate, rare decision rather than routine maintenance.

Vite copies `public/` to `dist/` verbatim, so no build configuration is needed.
