# UI & Design

## Visual identity — keep it

The existing look is a travel-journal scrapbook and it is the site's character. Preserve it:

- **Paper texture** (`/assets/paper.jpg`) behind content boxes, white rounded borders.
- **Postage-stamp navigation** — flat blocks in warm colours (amber, coral, salmon) with
  perforated edges, bold black labels, each rotated a degree or two so they look scattered
  rather than aligned. Rendered in pure CSS; see below.
- **Warm, muted map** beneath it all, evoking the original Stamen watercolor tiles.

The rewrite modernises the layout and the technology, not the personality.

## The stamps — pure CSS, no assets

Today: five PNGs (`stamp1.png`–`stamp5.png`, 150×59, ~24 KB each) mapped to menu items by
`:nth-child`, each a rough ink-block texture in a different warm hue.

**Drop the texture, keep the shape:** a flat colour with a perforated postage-stamp
silhouette. That makes the whole thing pure CSS — **no images, no SVG, nothing to download**.

### Technique

Perforations come from radial-gradient masks composited together — one layer per edge, with
`mask-composite: intersect` so each punches its own row or column of holes:

```css
.nav-stamp {
  --stamp-color: #e8a33d;
  --perf-r: 5px;    /* perforation radius */
  --perf-gap: 12px; /* spacing between perforations */

  background: var(--stamp-color);
  mask:
    radial-gradient(circle var(--perf-r) at 50% 0,    #0000 99%, #000) 0 0 / var(--perf-gap) 100%,
    radial-gradient(circle var(--perf-r) at 50% 100%, #0000 99%, #000) 0 0 / var(--perf-gap) 100%,
    radial-gradient(circle var(--perf-r) at 0 50%,    #0000 99%, #000) 0 0 / 100% var(--perf-gap),
    radial-gradient(circle var(--perf-r) at 100% 50%, #0000 99%, #000) 0 0 / 100% var(--perf-gap);
  mask-composite: intersect;
}
```

Treat this as a starting point, not a finished recipe — the radius, spacing and alignment need
tuning by eye so perforations land evenly on both axes at both mobile and desktop sizes.
`mask-composite: intersect` is well supported in current browsers; verify in Safari.

### Keeping it generic

The point of this change is that a sixth menu item must not need a sixth asset.

- **Colour** comes from `--stamp-color`. Define the warm palette (amber, coral, salmon, and
  two more in the same family) as custom properties and cycle them with
  `:nth-child(5n+1)` … `:nth-child(5n+5)`. A sixth item then picks up the first colour
  automatically instead of rendering untextured.
- **Rotation** cycles the same way — keep today's `1°, -3°, 0°, 2°, -1°` on desktop.
- Nothing about adding or removing a nav item should require touching an asset.

### Cleanup

`stamp1.png`–`stamp5.png` are deleted. `paper.jpg` stays — it is still the content-box
texture, which is unaffected by this change.

## Navigation

Five destinations: **videos · random · map · trips · about**.

### Desktop

Keep today's arrangement — stamps scattered in the lower-left over the map, rotations intact
(`1°, -3°, 0°, 2°, -1°`), 150×59 each.

### Mobile

Five items at 390 px wide is 78 px each — exactly right for a tab bar, and 5 is the practical
maximum for one. Recommended:

- **A bottom bar, five stamps in a single row.** Bottom placement is thumb-reachable, and the
  stamps stay visible rather than hiding behind a hamburger. With only five destinations,
  hiding navigation costs discoverability for no benefit.
- **Make it a layout sibling, not an overlay.** The mobile shell is a flex column at
  `height: 100dvh`; the bar is the last child. Nothing is occluded, and the map above it keeps
  its full area. (`dvh`, not `vh`, so mobile browser chrome does not clip it.)
- **Shrink the stamps and flatten the rotations** to roughly ±1°. Large rotations at small
  sizes collide with neighbours and waste horizontal space.
- **Keep a 44 px minimum touch height** even though the stamps are visually shorter — pad the
  tappable area rather than growing the graphic.
- Labels stay visible. Icons alone would not survive the stamp aesthetic.

Reject: hamburger menus (hides five items for no reason), horizontally scrolling stamp strips
(makes destinations undiscoverable), two-row grids (wastes ~100 px of vertical space).

## Layout

### Mobile — stacked, map-first

The key measurement: the videos are **landscape** and phones are held **portrait**. A
full-width 16:9 video on a 390×844 screen is only **219 px tall**. That leaves roughly 500 px
for everything else — enough for video details *and* a genuinely usable map, not a token strip.

```
┌─────────────────────┐
│ video   (219px)     │  full width, 16:9
├─────────────────────┤
│ details             │  name, country, date, description
│                     │
├─────────────────────┤
│                     │
│ map                 │  fills remaining space
│                     │
├─────────────────────┤
│ ▨ ▨ ▨ ▨ ▨           │  stamp nav bar
└─────────────────────┘
```

On `/map`, the map takes the whole area above the nav bar. On list views (`/trip`, `/video`)
the content scrolls and the map may be reduced or omitted.

Note `body { overflow: hidden }` in the current stylesheet must go — mobile needs scrolling.

### Desktop

Keep the current shape: full-bleed map as the background, content in a floating paper-textured
box, stamps lower-left. It works and it is distinctive.

One breakpoint is enough. Container queries are appropriate for components that appear in both
contexts (the video block, the details panel).

## CSS approach

Vanilla CSS. No Tailwind, no Sass.

- **Custom properties** for the palette, spacing scale, and stamp colours.
- **Native nesting** — replaces the one thing Sass was providing.
- **Container queries** for components that need to adapt to their container rather than the
  viewport.
- One stylesheet per view plus a shared base, mirroring `src/views/`.
- Mobile-first: write the narrow layout as the default, add the desktop layout in a
  `min-width` query.

The existing `.scss` files are a useful reference for colours and box styling but should be
rewritten rather than ported — they encode a desktop-only absolute-positioning model
(`position: absolute` with fixed insets everywhere) that is the reason there is no mobile
layout today.

## Views

| Route | Content |
|---|---|
| `/trip` | List of trips: name, year, and the video names within each |
| `/trip/:tripId` | Trip name/year, route map fitted to bounds, itinerary with day gaps, "watch all the videos of this trip" call to action |
| `/trip/:tripId/:videoId` | Video, details, prev/next links, "stop at this video" |
| `/video` | Heading with counts ("177 Videos from N Countries"), videos grouped by country with dates |
| `/video/:videoId` | Video with controls, full metadata, and which trips it belongs to |
| `/map` | Full-screen interactive map |
| `/random/:videoId` | Video, chained by people matching |
| `/about` | Intro text and the photo (`/assets/us.jpg`) |

## About page — must be rewritten

The current copy invites visitors to "write comments for trips and videos here at this
website". **No comment system has ever existed** — Disqus was configured but never rendered,
and comments are explicitly not wanted. Remove that sentence.

Also update: the Ember.js reference, and check the Facebook link is still wanted. Keep the
description of the people-chaining conceit — it explains the whole project and is the most
interesting thing on the page.

## Accessibility baseline

- Real `<a href>` elements for navigation so links are keyboard- and screen-reader-accessible
  and open in new tabs correctly.
- Visible focus states on the stamps — currently there are none.
- Sufficient contrast for black text on the amber/coral stamp textures; verify the lightest
  stamp colour passes.
- `<video>` needs no captions (there is no audio), but should carry a meaningful
  `aria-label` naming the place.
- Respect `prefers-reduced-motion`: skip the map fly-to animation and jump instead.
