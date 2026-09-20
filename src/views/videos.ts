import { countrySlug, type CountryGroup } from '../data/index.ts';
import { getCountryName } from '../data/country-names.ts';
import { formatDate } from '../format.ts';
import type { Locale } from '../i18n/locale.ts';
import { translations } from '../i18n/translations.ts';

interface Counts {
  videos: number;
  countries: number;
}

/** /:locale/video: heading with counts, videos grouped by country with dates. Trusted content. */
export function renderVideos(
  groups: CountryGroup[],
  counts: Counts,
  locale: Locale,
): string {
  const t = translations[locale];
  const sections = groups
    .map((group) => {
      const items = group.videos
        .map(
          (v) =>
            `<li><a href="/${locale}/video/${v.id}">${v.name}</a> — ${formatDate(v.date)}</li>`,
        )
        .join('');
      return `
        <section>
          <h2><a class="cta-stamp cta-stamp--small country-stamp" href="/${locale}/country/${countrySlug(group.country)}">${getCountryName(group.country, locale)}</a></h2>
          <ul>${items}</ul>
        </section>
      `;
    })
    .join('');

  return `
    <div class="videos">
      <h1>${t.videos.heading(counts.videos, counts.countries)}</h1>
      <div class="videos-list">${sections}</div>
    </div>
  `;
}
