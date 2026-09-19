import { countrySlug, type CountryGroup } from '../data/index.ts';
import { formatDate } from '../format.ts';

interface Counts {
  videos: number;
  countries: number;
}

/** /video: heading with counts, videos grouped by country with dates. Trusted content. */
export function renderVideos(groups: CountryGroup[], counts: Counts): string {
  const sections = groups
    .map((group) => {
      const items = group.videos
        .map(
          (v) =>
            `<li><a href="/video/${v.id}">${v.name}</a> — ${formatDate(v.date)}</li>`,
        )
        .join('');
      return `
        <section>
          <h2><a class="cta-stamp cta-stamp--small country-stamp" href="/country/${countrySlug(group.country)}">${group.country}</a></h2>
          <ul>${items}</ul>
        </section>
      `;
    })
    .join('');

  return `
    <div class="videos">
      <h1>${counts.videos} Videos from ${counts.countries} Countries</h1>
      <div class="videos-list">${sections}</div>
    </div>
  `;
}
