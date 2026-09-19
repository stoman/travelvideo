import type { CountryGroup } from '../data/index.ts';

interface Counts {
  videos: number;
  countries: number;
}

/** /video: heading with counts, videos grouped by country with dates. Trusted content. */
export function renderVideos(groups: CountryGroup[], counts: Counts): string {
  const sections = groups
    .map((group) => {
      const items = group.videos
        .map((v) => `<li><a href="/video/${v.id}">${v.name}</a> — ${v.date}</li>`)
        .join('');
      return `
        <section>
          <h2>${group.country}</h2>
          <ul>${items}</ul>
        </section>
      `;
    })
    .join('');

  return `
    <div class="videos">
      <h1>${counts.videos} Videos from ${counts.countries} Countries</h1>
      ${sections}
    </div>
  `;
}
