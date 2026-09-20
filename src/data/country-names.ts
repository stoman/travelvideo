import type { Locale } from '../i18n/locale.ts';

/**
 * Display names per locale, keyed by the exact `country` string stored in videos.json. The key
 * is also what `countrySlug()` (see index.ts) slugifies for `/country/:slug` -- that slug basis
 * is deliberately untouched here, so URLs stay stable across locales even where the raw key
 * itself isn't quite proper English (`Hongkong`, `Simbabwe`, `Macedonia`, `Sint Marteen`): the
 * `en` value below corrects those for display without renaming the key/URL.
 */
export const countryNames: Record<string, { en: string; de: string }> = {
  Austria: { en: 'Austria', de: 'Österreich' },
  'Bosnia and Herzegovina': {
    en: 'Bosnia and Herzegovina',
    de: 'Bosnien und Herzegowina',
  },
  Botswana: { en: 'Botswana', de: 'Botswana' },
  Bulgaria: { en: 'Bulgaria', de: 'Bulgarien' },
  China: { en: 'China', de: 'China' },
  Croatia: { en: 'Croatia', de: 'Kroatien' },
  'Dominican Republic': {
    en: 'Dominican Republic',
    de: 'Dominikanische Republik',
  },
  Ecuador: { en: 'Ecuador', de: 'Ecuador' },
  Finland: { en: 'Finland', de: 'Finnland' },
  France: { en: 'France', de: 'Frankreich' },
  Germany: { en: 'Germany', de: 'Deutschland' },
  Haiti: { en: 'Haiti', de: 'Haiti' },
  Hongkong: { en: 'Hong Kong', de: 'Hongkong' },
  Iceland: { en: 'Iceland', de: 'Island' },
  India: { en: 'India', de: 'Indien' },
  Indonesia: { en: 'Indonesia', de: 'Indonesien' },
  Italy: { en: 'Italy', de: 'Italien' },
  Japan: { en: 'Japan', de: 'Japan' },
  Macedonia: { en: 'North Macedonia', de: 'Nordmazedonien' },
  Malaysia: { en: 'Malaysia', de: 'Malaysia' },
  Montenegro: { en: 'Montenegro', de: 'Montenegro' },
  Namibia: { en: 'Namibia', de: 'Namibia' },
  'New Zealand': { en: 'New Zealand', de: 'Neuseeland' },
  Norway: { en: 'Norway', de: 'Norwegen' },
  Portugal: { en: 'Portugal', de: 'Portugal' },
  'Puerto Rico': { en: 'Puerto Rico', de: 'Puerto Rico' },
  Qatar: { en: 'Qatar', de: 'Katar' },
  Romania: { en: 'Romania', de: 'Rumänien' },
  Serbia: { en: 'Serbia', de: 'Serbien' },
  Simbabwe: { en: 'Zimbabwe', de: 'Simbabwe' },
  Singapore: { en: 'Singapore', de: 'Singapur' },
  'Sint Marteen': { en: 'Sint Maarten', de: 'Sint Maarten' },
  Slovenia: { en: 'Slovenia', de: 'Slowenien' },
  'South Africa': { en: 'South Africa', de: 'Südafrika' },
  Spain: { en: 'Spain', de: 'Spanien' },
  'St Kitts and Nevis': { en: 'St Kitts and Nevis', de: 'St. Kitts und Nevis' },
  Sweden: { en: 'Sweden', de: 'Schweden' },
  Thailand: { en: 'Thailand', de: 'Thailand' },
  'US Virgin Islands': {
    en: 'US Virgin Islands',
    de: 'Amerikanische Jungferninseln',
  },
  'United Arab Emirates': {
    en: 'United Arab Emirates',
    de: 'Vereinigte Arabische Emirate',
  },
  'United States of America': {
    en: 'United States of America',
    de: 'Vereinigte Staaten von Amerika',
  },
};

/** Falls back to the raw string; unreachable in practice, see the invariants.test.ts check. */
export function getCountryName(rawCountry: string, locale: Locale): string {
  return countryNames[rawCountry]?.[locale] ?? rawCountry;
}
