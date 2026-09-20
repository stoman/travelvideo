export type Locale = 'en' | 'de';

export const LOCALES: Locale[] = ['en', 'de'];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

/**
 * Pure: picks the first of `languages` (BCP 47 tags, e.g. `navigator.languages`) whose primary
 * subtag matches a supported locale, falling back to `DEFAULT_LOCALE`. No browser access, so
 * this is unit-testable with plain arrays.
 */
export function pickLocale(languages: readonly string[]): Locale {
  for (const tag of languages) {
    const primary = tag.split('-')[0]?.toLowerCase();
    if (primary && isLocale(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}

const STORAGE_KEY = 'travelvideo:locale';

/** Wrapped in try/catch: private browsing or blocked storage can throw on access. */
export function getStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function setStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Ignore: nothing sensible to do if storage is blocked, and the site works without it.
  }
}

/** A previously-chosen locale wins over the browser's language list. */
export function detectPreferredLocale(): Locale {
  return (
    getStoredLocale() ?? pickLocale(navigator.languages ?? [navigator.language])
  );
}
