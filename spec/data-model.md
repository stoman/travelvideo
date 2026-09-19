# Data Model

## Inventory

**177 videos across 16 trips** as of 2026-09-18. Trip ids: `all`, `interrail`, `china`,
`sicily`, `aida_canary_islands`, `iceland`, `world`, `westcoast_usa`, `portugal`, `harz`,
`caribbean`, `romania`, `olympia_toskana`, `oscars`, `spitzingsee`, `mallorca`.

## Video

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Stable slug, also the URL segment. e.g. `hobbiton` |
| `name` | string | Display name, may contain non-ASCII (`München Flughafen`, `Jökulsárlón`) |
| `description` | string | Optional note; frequently empty |
| `country` | string | Free text, used for grouping on the video index |
| `filename` | string | e.g. `hobbiton.mp4`, served from `/assets/videos/` |
| `date` | ISO date string | `2017-09-19`. Drives trip ordering and day-gap calculation |
| `latitude` | number | Decimal degrees |
| `longitude` | number | Decimal degrees |
| `peopleIn` | string | Comma-separated names walking *into* frame |
| `peopleOut` | string | Comma-separated names walking *out of* frame |
| `peopleStart` | string | Who is visible when the clip **starts** |
| `peopleEnd` | string | Who is visible when the clip **ends** |
| `guests` | string | Optional, e.g. `Lady Liberty`, `3 butterflies` |
| `camera` | string | e.g. `Sony Alpha 6000` |
| `preferredZoom` | number | Map zoom level to use when showing this video (5–12) |

`trips` is a relationship in the Ember model but should be **derived** in the rewrite — see
Derived data below.

## Trip

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Stable slug, also the URL segment |
| `name` | string | e.g. `Around the World` |
| `year` | string | Free text, e.g. `2017` or `2013 - today` |
| `videos` | string[] | **Ordered** video ids. Order is the itinerary, not incidental |
| `finished` | boolean | Whether the trip is complete — controls route-loop closing |

### The `all` trip is synthetic

`trips.json` contains **15 real trips**. The sixteenth, `all`, is **derived at load time and
never stored** — storing it would duplicate all 177 video ids and let them drift out of sync
with reality.

Construct it as:

```ts
{
  id: 'all',
  name: 'All Videos',
  year: '2013 - today',
  videos: <every video id, sorted by date ascending>,
  finished: false,
}
```

Rules for it:

- **Include it in the trip list** shown at `/trip`, and make `/trip/all` work — it is a real
  destination today and links to it may exist.
- **Exclude it from map route rendering.** Its polyline would connect every video on earth
  into one meaningless line. See [map.md](map.md).
- **Exclude it from the per-video trip membership list** on `/video/:videoId`. It is true of
  every video and carries no information. This differs from current behaviour, where it
  appears on every video.
- **Exclude it from the trip-based invariants** below. It is generated from the video list, so
  checking videos against it is circular.

## The people-chaining conceit

**This is the point of the whole video series and must be preserved.**

Clips are filmed so that the people visible at the end of one clip are the people visible at
the start of the next, making the footage feel continuous across cuts. `peopleStart` and
`peopleEnd` encode this.

Two places depend on it:

- **Trip playback** relies on it implicitly — the trip's `videos` array is already ordered so
  the chain holds.
- **Random mode** relies on it explicitly: when a video ends, pick a random next video whose
  `peopleStart` equals the current video's `peopleEnd`. This is what makes endless random
  playback feel coherent rather than jumpy.

Matching is an exact string comparison on the whole field in the current implementation
(`'Anna, Anna-Maria'` matches only `'Anna, Anna-Maria'`, not `'Anna'`). Preserve that
behaviour; do not "improve" it into fuzzy or set-based matching without asking.

Edge case to handle: if no video matches `peopleEnd`, fall back to any random video rather
than dead-ending.

## Migration from Ember fixtures

Source of truth is `app/models/video.js` and `app/models/trip.js` on `main` — static
`FIXTURES` arrays on the model classes. Everything is there; nothing needs recovering from
elsewhere.

Write a **one-time** migration script (not part of the build) that reads those two files and
emits `src/data/videos.json` and `src/data/trips.json`. Parsing them as JS modules is more
robust than regex over the source.

Normalisations to apply during migration:

- Keep `date` as an ISO `YYYY-MM-DD` string. Do not convert to `Date` at rest — parse at use.
  Storing dates as strings keeps the JSON diffable and avoids timezone drift.
- Drop the `trips` relationship from video records; derive it instead.
- **Drop the `all` trip.** It is derived at load time now — see above. `trips.json` should
  contain 15 entries, not 16. Verify the derived `all` matches the fixture's video list
  exactly as a one-off migration check, then discard the fixture version.
- Preserve field order and formatting so the JSON diffs legibly when a trip is added.
- Verify the emitted data passes every invariant below before committing.

After migration the Ember model files are deleted along with the rest of the app.

## Derived data

Compute once at module load, never stored in the source files:

- **`videoToTrips`** — reverse index from video id to the trips containing it, replacing the
  Ember `hasMany`. Needed by the video detail view.
- **`videosByCountry`** — grouping for `/video`, sorted by country name then by video name.
- **Day gaps** — for the trip overview itinerary. For consecutive videos in a trip,
  `ceil((date[n] - date[n-1]) / 86400000) - 1`. A positive result renders as
  "N days without video" between entries. Zero or negative renders nothing.
- **Counts** — total videos and distinct countries, shown as a heading on `/video`.
- **Trip GeoJSON** — a `LineString` per trip. See [map.md](map.md) for the home-coordinate
  anchoring rule.

## Invariants

These are the highest-value tests in the project — they catch the realistic failure mode,
which is a typo while adding a trip. See [testing.md](testing.md).

- Video ids are unique; trip ids are unique.
- Every video id referenced by a trip exists.
- **Every video is referenced by at least one real trip.** Now that `all` is derived rather
  than stored, this is a genuinely useful check: it catches a video added to `videos.json`
  that was never assigned to a trip, which would otherwise be reachable only by direct URL.
- `latitude` ∈ [-90, 90], `longitude` ∈ [-180, 180], and neither is `0.0`. The current data is
  clean on all three — placeholder `0.0, 0.0` coordinates have reached `main` before, so this
  is a guard against recurrence rather than a known problem.
- `preferredZoom` is an integer within the map's configured min/max zoom.
- `date` parses as a valid ISO date.
- Dates are non-decreasing within each trip's `videos` order.
- `filename` is non-empty and unique.
- **People chain integrity:** for consecutive videos in a trip, `peopleEnd[n]` equals
  `peopleStart[n+1]`. The current data has **exactly five violations**, all in two trips:

  | Trip | Break |
  |---|---|
  | `china` | `peking` ends *Anna* → `peking_olympic_park` starts *Stefan* |
  | `china` | `tiantouzhai` ends *Anna, Anna-Maria, Jasmin* → `tiantouzhai2` starts *Stefan* |
  | `china` | `tiantouzhai2` ends *Anna* → `yangshuo` starts *Anna, Anna-Maria, Jasmin* |
  | `world` | `miami_beach` ends *Anna* → `miami` starts *Stefan* |
  | `world` | `miami` ends *Anna* → `quito` starts *Stefan* |

  These may be intentional — the chain plausibly restarts across a travel day or a change of
  companions — so do not "fix" the data. Implement the check, list these five as known
  exceptions, and confirm each before promoting the check to a hard failure.
- **Every `filename` resolves to a file that exists** in `public/assets/videos/`. Since
  the videos are committed to the repo, this is fully enforceable in CI — a trip referencing a
  video that was never added will fail the build instead of 404-ing in production.
