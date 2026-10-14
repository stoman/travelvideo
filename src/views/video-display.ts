import type { Video } from '../data/types.ts';
import type { Locale } from '../i18n/locale.ts';
import { renderVideoDisplayShell } from './video-info.ts';

/**
 * /:locale/video/:videoId: the standalone video view -- full player controls, no trip nav, since
 * it isn't part of an ordered playback sequence. See video-info.ts for the shared metadata block.
 */
export function renderVideoDisplay(video: Video, locale: Locale): string {
  return renderVideoDisplayShell('video-display', video, locale, {
    controls: true,
  });
}
