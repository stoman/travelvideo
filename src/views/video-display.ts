import type { Video } from '../data/types.ts';
import { renderVideoDisplayShell } from './video-info.ts';

/**
 * /video/:videoId: the standalone video view -- full player controls, no trip nav, since it
 * isn't part of an ordered playback sequence. See video-info.ts for the shared metadata block.
 */
export function renderVideoDisplay(video: Video): string {
  return renderVideoDisplayShell('video-display', video, { controls: true });
}
