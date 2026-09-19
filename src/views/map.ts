/**
 * /map: full-screen interactive map. The map itself lives in the persistent #map element, not
 * here -- this just gives the route a landmark heading. Full-screen layout is Phase 6's CSS.
 */
export function renderMap(): string {
  return `
    <div class="map-view">
      <h1>Map</h1>
      <p>Drag to move around, scroll or pinch to zoom.</p>
    </div>
  `;
}
