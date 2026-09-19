import type { Video, Trip } from '../data/types.ts';

/**
 * <video> markup shared by video-display (controls) and trip/random playback (no controls,
 * lean-back and chained). Always muted + playsinline: the clips are silent by convention, so
 * autoplay works unconditionally with no permission prompt, and iOS needs playsinline or it
 * takes the video fullscreen.
 */
export function videoElementHtml(
  video: Video,
  options: { controls: boolean } = { controls: false },
): string {
  const controlsAttr = options.controls ? ' controls' : '';
  return `<video id="player" src="/assets/videos/${video.filename}" muted playsinline autoplay preload="metadata" aria-label="${video.name}"${controlsAttr}></video>`;
}

/** Next video id in the trip's order, or null if `currentVideoId` is last (or not in the trip). */
export function nextVideoIdInTrip(
  trip: Trip,
  currentVideoId: string,
): string | null {
  const index = trip.videos.indexOf(currentVideoId);
  if (index === -1 || index === trip.videos.length - 1) return null;
  return trip.videos[index + 1]!;
}

export function pickRandomVideo(videos: Video[]): Video {
  const video = videos[Math.floor(Math.random() * videos.length)];
  if (!video) throw new Error('pickRandomVideo: empty video list');
  return video;
}

/**
 * Random-mode chaining: a video whose peopleStart matches the current video's peopleEnd, so the
 * people on screen carry across the cut. Falls back to any random video if nothing matches,
 * rather than dead-ending. Matching is an exact string comparison, per data-model.md.
 */
export function pickChainedVideo(current: Video, allVideos: Video[]): Video {
  const candidates = allVideos.filter(
    (v) => v.peopleStart === current.peopleEnd,
  );
  return pickRandomVideo(candidates.length > 0 ? candidates : allVideos);
}

export function attachEndedHandler(
  videoEl: HTMLVideoElement,
  onEnded: () => void,
): void {
  videoEl.addEventListener('ended', onEnded, { once: true });
}

let currentPrefetchLink: HTMLLinkElement | null = null;

/**
 * Prefetches one clip ahead -- never more, since visitors abandon trips midway and the data
 * would be wasted. Replaces any previous prefetch so at most one stays in the document.
 */
export function prefetchVideo(filename: string): void {
  currentPrefetchLink?.remove();
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.setAttribute('as', 'video');
  link.href = `/assets/videos/${filename}`;
  document.head.appendChild(link);
  currentPrefetchLink = link;
}
