import type { Locale } from '../i18n/locale.ts';
import { translations } from '../i18n/translations.ts';

/** Shown both for URLs that don't match any route and for a valid route with an unknown id. */
export function renderNotFound(locale: Locale): string {
  const t = translations[locale].notFound;
  const tripsHref = `/${locale}/trip`;
  const videosHref = `/${locale}/video`;
  return `
    <div class="not-found">
      <h1>${t.heading}</h1>
      <p>${t.body(tripsHref, videosHref)}</p>
    </div>
  `;
}
