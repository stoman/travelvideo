import type { Locale } from '../i18n/locale.ts';
import { translations } from '../i18n/translations.ts';

/**
 * /:locale/map: full-screen interactive map. The map itself lives in the persistent #map
 * element, not here -- this just gives the route a landmark heading. Full-screen layout is
 * Phase 6's CSS.
 */
export function renderMap(locale: Locale): string {
  const t = translations[locale].map;
  return `
    <div class="map-view">
      <h1>${t.heading}</h1>
      <p>${t.instructions}</p>
    </div>
  `;
}
