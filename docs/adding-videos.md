# Adding a video

Steps for adding a new clip (or a whole new trip) to the site.

## 1. Name and place the file

Pick a slug: lowercase, `snake_case`, no spaces — this becomes both the video's `id` and its
filename. It should be short and identify the place (e.g. `hobbiton`, `zhangjiajie_nationalpark`).
If the slug collides with an existing one, disambiguate with a number or qualifier
(`paris1`, `paris2`, `miami_beach`).

## 2. Normalise the source clip

**This step is permanent once committed** — the video archive lives in git at
`public/assets/videos/`, and git keeps every version of a binary forever. Re-encoding later
doesn't replace the old bytes, it adds new ones on top. Get the encode right once:

```
ffmpeg -i <source> \
  -vf "scale=iw*sar:ih:flags=lanczos,setsar=1,scale='trunc(min(1280,iw)/2)*2':-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf 21 \
  -pix_fmt yuv420p -profile:v high \
  -an -movflags +faststart \
  "public/assets/videos/<slug>.mp4"
```

What each flag does:

- **The two-stage `scale` filter.** Stage one, `scale=iw*sar:ih`, corrects for anamorphic
  source footage (pixels that aren't square — common from some cameras/editors) by resizing to
  the actual _display_ width using the sample aspect ratio, then `setsar=1` marks the pixels as
  square so nothing downstream re-applies the correction. Stage two,
  `scale='trunc(min(1280,iw)/2)*2':-2`, caps the result at 720p and **never upscales** — a
  source narrower than 1280px stays as-is, since there's no detail to invent. `trunc(.../2)*2`
  forces the width to an even number, which 4:2:0 chroma subsampling requires; `-2` computes the
  height to match, also rounded to even. Don't collapse this to a single-stage
  `scale='min(1280,iw*sar)':-2` — for anamorphic sources that can compute an odd target width
  and silently produce the wrong aspect ratio. Camera output is usually _not_ anamorphic (SAR
  1:1), in which case stage one is a no-op and this behaves like a plain resize-and-cap.
- `-crf 21`: conservative — these are re-encodes of already-lossy footage, and 21 keeps the
  extra generation loss invisible while still cutting bitrate substantially.
- `-preset slow`: better compression for a cost that doesn't matter at these clip lengths.
- `-an`: strips audio. All existing clips are silent by convention (filmed holding a sign, no
  narration) — if a new clip genuinely has audio worth keeping, drop this flag and reconsider
  the player's `muted` assumption in `src/video/player.ts` first.
- `-movflags +faststart`: moves the moov atom to the front so playback can start before the
  whole file has downloaded.

**Verify before committing:** the output opens, its duration matches the source, and look at a
frame from each (`ffmpeg -ss <t> -i <file> -frames:v 1 out.png`) to confirm the aspect ratio and
quality look right. A smaller output file is common but not guaranteed — an anamorphic source
that's corrected to a wider display size can legitimately end up larger, since it now has to
encode genuinely more pixels; that's not a bug.

## 3. Add the data entries

### `src/data/videos.json`

Add an entry with this shape (keep the field order — it's what keeps diffs readable):

```json
{
  "id": "slug",
  "name": "Display Name",
  "description": "",
  "country": "Country",
  "filename": "slug.mp4",
  "date": "YYYY-MM-DD",
  "latitude": 0.0,
  "longitude": 0.0,
  "peopleIn": "",
  "peopleOut": "",
  "peopleStart": "",
  "peopleEnd": "",
  "guests": "",
  "camera": "",
  "preferredZoom": 8
}
```

- **`latitude`/`longitude`**: decimal degrees. Find them by right-clicking the location on any
  map (Google Maps, OpenStreetMap) and copying the coordinates it shows. Never leave these at
  `0.0, 0.0` — that's a real place in the Gulf of Guinea, not "unset", and the invariant tests
  reject it.
- **`preferredZoom`**: the map zoom level used when flying to this video specifically (not the
  same as the overall map's zoom range). Existing values range 5–12: lower for a
  wide/rural/remote place, higher for a dense city block. Look at a few nearby existing entries
  in the same country for a reasonable starting point.
- **`peopleStart`/`peopleEnd`**: who's visible at the very start/end of the clip, comma-separated
  exactly as elsewhere in the data (matching is an exact string comparison, not fuzzy — `'Anna'`
  and `'Anna, Stefan'` are different values). This is what makes the chaining work; see below.
- **`peopleIn`/`peopleOut`**: who visibly walks into/out of frame during the clip, if anyone.
  Can be empty.

### `src/data/trips.json`

If this video extends an existing trip, add its `id` to that trip's `videos` array **in
itinerary order** — the array order is what drives playback order and route drawing, not just a
list. If it's a new trip, add a new entry:

```json
{
  "id": "trip_slug",
  "name": "Display Name",
  "year": "2026",
  "videos": ["first_video", "second_video"],
  "finished": true
}
```

Set `finished: false` for a trip still in progress (an ongoing multi-year one, or one you expect
to add more videos to later) — it changes whether the map route line closes back to home. Don't
add the video to a `trips.json` entry called `all` — that trip is derived automatically at load
time from every video's existence; it isn't stored and shouldn't be edited directly.

## 4. Preserve the people-chaining conceit

This is the point of the whole video series: the people visible at the **end** of one clip
should be the people visible at the **start** of the next, so trip playback feels continuous
across cuts. When inserting a video into an existing trip's sequence, check that:

- the previous video's `peopleEnd` equals the new video's `peopleStart`, and
- the new video's `peopleEnd` equals the next video's `peopleStart` (if there is a next video).

If the chain genuinely can't hold — a travel day with no clip, or a change of who's filming —
that's fine; it happens in the existing data too. Just don't let it happen by accident.

## 5. Run the tests before committing

```
npm test
```

This runs `tsc --noEmit` and the content-invariant test suite (`src/data/invariants.test.ts`)
against the real data — unique ids, every trip-referenced video existing, valid coordinates, a
valid `preferredZoom`, non-decreasing dates within a trip, the filename resolving to an actual
file in `public/assets/videos/`, and the people-chain rule above. It's the cheapest way to catch
a typo before it reaches the live site instead of 404ing there.

A few pre-existing violations are known and allowed through as warnings rather than failures —
grep `invariants.test.ts` for `KNOWN_` to see the current list. Don't add a new video to one of
those lists to make a test pass; they're for specific, already-reviewed historical exceptions,
not a general escape hatch.
