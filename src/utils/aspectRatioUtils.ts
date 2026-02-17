/**
 * Aspect ratio utilities for video selection
 */

import { GalleryItem } from '../types/gallery';
import { TARGET_VIDEO_RATIO } from '../constants';

/**
 * Calculate how far a video's aspect ratio is from target (9:16)
 * Lower = closer to target
 */
export function getAspectRatioDiff(aspectRatio: number | undefined): number {
  if (!aspectRatio || aspectRatio <= 0) {
    return Infinity; // Undefined ratios are not candidates
  }
  return Math.abs(aspectRatio - TARGET_VIDEO_RATIO);
}

/**
 * Compare two videos and return the one closest to 9:16 ratio
 * Tiebreaker: if equal distance, return the one appearing first
 */
export function selectBestPortraitVideo(
  video1: GalleryItem,
  video2: GalleryItem,
  index1: number,
  index2: number,
): GalleryItem {
  const diff1 = getAspectRatioDiff(video1.aspectRatio);
  const diff2 = getAspectRatioDiff(video2.aspectRatio);

  // If one is clearly better
  if (diff1 < diff2) return video1;
  if (diff2 < diff1) return video2;

  // Tiebreaker: earlier in list wins
  return index1 < index2 ? video1 : video2;
}

/**
 * Find best video in a list for a specific page
 */
export function findBestVideoInWindow(
  videos: Array<{ item: GalleryItem; index: number }>,
): { item: GalleryItem; index: number } | null {
  if (videos.length === 0) return null;
  if (videos.length === 1) return videos[0];

  let bestVideo = videos[0];
  let bestDiff = getAspectRatioDiff(videos[0].item.aspectRatio);

  for (let i = 1; i < videos.length; i++) {
    const diff = getAspectRatioDiff(videos[i].item.aspectRatio);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestVideo = videos[i];
    }
  }

  return bestVideo;
}
