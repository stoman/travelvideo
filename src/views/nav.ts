import type { Locale } from '../i18n/locale.ts';
import { translations } from '../i18n/translations.ts';

/**
 * The nav bar: five translated, locale-prefixed links plus a 6th stamp -- the language switch,
 * showing the flag and own-name of the *other* locale (see nav.css's comment: a 6th nav item
 * already cycles back to the 1st stamp color, which is exactly what this adds). `switchHref` is
 * the current page's equivalent URL in the other locale, built by `switchLocalePath` in
 * router.ts.
 */
export function renderNav(locale: Locale, switchHref: string): string {
  const t = translations[locale];
  return `
    <a class="nav-stamp" href="/${locale}/video">${t.nav.videos}</a>
    <a class="nav-stamp" href="/${locale}/random">${t.nav.random}</a>
    <a class="nav-stamp" href="/${locale}/map">${t.nav.map}</a>
    <a class="nav-stamp" href="/${locale}/trip">${t.nav.trips}</a>
    <a class="nav-stamp" href="/${locale}/about">${t.nav.about}</a>
    <a class="nav-stamp" href="${switchHref}">${t.nav.switchTo}</a>
  `;
}
