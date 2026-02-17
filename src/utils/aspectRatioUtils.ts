import { GalleryItem } from '../types/gallery';
import { TARGET_VIDEO_RATIO } from '../constants';

export function getAspectRatioDiff(aspectRatio: number | undefined): number {
  if (!aspectRatio || aspectRatio <= 0) {
    return Infinity;
  }
  return Math.abs(aspectRatio - TARGET_VIDEO_RATIO);
}

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
