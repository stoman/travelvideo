import type { Video } from '../data/types.ts';
import type { Locale } from '../i18n/locale.ts';
import { translations } from '../i18n/translations.ts';
import { renderVideoDisplayShell } from './video-info.ts';

/**
 * /:locale/random/:videoId: playback chained by people matching, no controls. Chaining itself
 * (advancing on `ended` to the precomputed next video) is wired in main.ts. The only nav that
 * makes sense here is a way off the random shuffle onto the video's own page -- there's no
 * prev/trip context to link back to. See video-info.ts for the shared metadata block.
 */
export function renderRandomDisplay(video: Video, locale: Locale): string {
  const t = translations[locale].playback;
  const nav = `<nav><a href="/${locale}/video/${video.id}">${t.stopAtThisVideo}</a></nav>`;
  return renderVideoDisplayShell('random-display', video, locale, { nav });
}
