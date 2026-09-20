import type { Locale } from '../i18n/locale.ts';
import { translations } from '../i18n/translations.ts';

const GITHUB_REPO_URL = 'https://github.com/stoman/travelvideo';

/**
 * Static content, authored and committed by Stefan -- trusted, interpolated directly.
 * Route params are never involved here, so there's nothing from the URL to escape.
 */
export function renderAbout(locale: Locale): string {
  const t = translations[locale].about;
  const tripsHref = `/${locale}/trip`;
  const mapHref = `/${locale}/map`;
  const randomHref = `/${locale}/random`;

  return `
    <div class="about">
      <h1>${t.heading}</h1>
      <img src="/assets/us.jpg" alt="${t.imageAlt}" class="us" />
      <p>${t.intro}</p>
      <p>${t.explore(tripsHref, mapHref, randomHref)}</p>
      <p>${t.github(GITHUB_REPO_URL)}</p>
      <p>${t.seeYou}</p>
    </div>
  `;
}
