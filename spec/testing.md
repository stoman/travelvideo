# Testing

## Runner

**`node:test` with `node:assert`.** Both are built into the Node runtime — not npm packages.
No `package.json` entry, no version to bump, no transitive dependencies, no supply-chain
surface. Node is already required to build the site, so the test runner adds nothing.

```bash
node --test
```

Do not add Vitest, Jest, Mocha, Playwright or jsdom. The architecture in
[architecture.md](architecture.md) — views as pure `(data) => string` functions — exists
specifically so that none of them are necessary.

## Content invariants — the highest-value tests

The realistic failure mode for this site is **a typo while adding a trip**, not a logic bug.
These tests catch that, and they are worth more than everything else combined. Every rule from
the Invariants section of [data-model.md](data-model.md) becomes a test:

- Unique video ids; unique trip ids; unique filenames.
- Every video id referenced by a trip exists.
- Every video appears in at least one trip.
- Coordinates within valid ranges and not placeholder `0.0, 0.0` — this has occurred in real
  commits.
- `preferredZoom` an integer within the map's min/max.
- `date` parses; dates non-decreasing within each trip's order.
- **People chain integrity**: `peopleEnd[n] === peopleStart[n+1]` within each trip. Expect
  pre-existing violations in the historical data — start by reporting them as warnings and
  ask Stefan which are genuine errors before promoting this to a hard failure.
- Every `filename` resolves to a file present in `public/assets/videos/`. Fully
  enforceable in CI now that the videos are committed to the repo.
- Every video appears in at least one **real** trip — the derived `all` trip does not count,
  since checking videos against a list generated from them is circular.

A bad trip addition then fails in CI rather than 404-ing in production.

## Pure logic

- People-chaining candidate selection for random mode, including the no-match fallback.
- Day-gap calculation for the trip itinerary (including the off-by-one: `ceil(diff) - 1`, and
  that zero or negative gaps render nothing).
- Country grouping and sort order.
- Trip GeoJSON construction: home coordinate prepended, loop closed only when
  `trip.finished`, `all` excluded.
- `parseRoute(pathname)` for every URL in the routing table — especially the ambiguous cases
  `/trip/start/:tripId` vs `/trip/:tripId`, and `/trip/:tripId` vs `/trip/:tripId/:videoId`.
  Include unknown paths resolving to not-found.

## Views

Views return strings, so assert on the returned markup: that a trip overview lists its videos
in order, that day gaps appear where expected, that the video detail view renders every
populated metadata field and omits empty ones.

Keep these assertions behavioural — check that a video's name appears, not that it is wrapped
in a particular `div`. Tests that assert on exact markup will fight every styling change.

## What is deliberately not tested

**Whether MapLibre visually draws anything.** Verifying that requires a real browser with
WebGL, which means Playwright — a browser-automation dependency for essentially one assertion.
Not worth it by this project's standards.

What *is* testable without a browser, and should be, is everything feeding the map: the
GeoJSON construction, the coordinate validity, the cluster configuration object, the
`flyTo` parameters derived from a video.

Visual and interaction correctness is verified by looking at the site — on a real phone, not
just a narrow desktop window.

## CI wiring

The repo already has working GitHub Actions. Adapt rather than replace:

- `test.yml` runs `npm test` — repoint that script at `node --test`.
- `lint.yml` runs `npm run lint` — replace the Ember-specific linters (ember-template-lint,
  eslint-plugin-ember, eslint-plugin-qunit) with plain ESLint plus Prettier, or drop linting
  to ESLint alone. Removing stylelint is defensible now that the CSS is hand-written and
  small.
- Both already trigger on `pull_request` and pushes to `main`. Leave that alone.

Type checking (`tsc --noEmit`) should be added to CI — it is the cheapest correctness check
available and catches most of what a heavier test suite would.
