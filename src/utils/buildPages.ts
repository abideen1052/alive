/**
 * Core algorithm to build pages from gallery items
 * Each page = 3 tiles (1 left + 2 right stacked)
 * Only 1 video per page, selected by closest to 9:16 ratio
 */

import { GalleryItem, PageLayout } from '../types/gallery';
import { VIDEO_SELECTION_LOOKAHEAD } from '../constants';
import { findBestVideoInWindow } from './aspectRatioUtils';

/**
 * Build pages from gallery items
 *
 * Algorithm:
 * 1. Loop through items
 * 2. For each page:
 *    a) Look ahead N items
 *    b) Find video closest to 9:16 ratio
 *    c) Fill left column with video (if found) or first image
 *    d) Fill right column with 2 images (or video if not enough images)
 *    e) Move to next page
 *
 * @param items - Gallery items from API
 * @param lookahead - Number of items to look ahead (default 12)
 * @returns Array of PageLayout objects
 */
export function buildPages(
  items: GalleryItem[],
  lookahead: number = VIDEO_SELECTION_LOOKAHEAD,
): PageLayout[] {
  // Defensive: empty input
  if (!items || items.length === 0) {
    return [];
  }

  const pages: PageLayout[] = [];
  const remaining = [...items]; // Make a copy

  while (remaining.length > 0) {
    // STEP 1: SELECT VIDEO FOR THIS PAGE
    let selectedVideo: GalleryItem | null = null;
    let selectedVideoIndex: number = -1;

    // Look only at next (lookahead) items
    const windowSize = Math.min(lookahead, remaining.length);
    const videosInWindow: Array<{ item: GalleryItem; index: number }> = [];

    for (let i = 0; i < windowSize; i++) {
      if (remaining[i].type === 'video') {
        videosInWindow.push({ item: remaining[i], index: i });
      }
    }

    // Find best video in window
    if (videosInWindow.length > 0) {
      const bestVideoObj = findBestVideoInWindow(videosInWindow);
      if (bestVideoObj) {
        selectedVideo = bestVideoObj.item;
        selectedVideoIndex = bestVideoObj.index;
        // Remove from remaining
        remaining.splice(selectedVideoIndex, 1);
      }
    }

    // STEP 2: FILL COLUMN 1 (LEFT)
    let left: GalleryItem;

    if (selectedVideo) {
      left = selectedVideo;
    } else {
      // No video, take first item (should be image)
      left = remaining.shift()!;
    }

    // STEP 3: FILL COLUMN 2 (RIGHT - 2 stacked tiles)
    let rightTop: GalleryItem;
    let rightBottom: GalleryItem;

    if (remaining.length >= 2) {
      // We have at least 2 items, take them
      rightTop = remaining.shift()!;
      rightBottom = remaining.shift()!;
    } else if (remaining.length === 1) {
      // Only 1 item left
      rightTop = remaining.shift()!;

      // If we have unused selectedVideo, put in rightBottom
      // (This means left was filled with something else)
      // But this shouldn't happen with our logic above
      rightBottom = remaining.length > 0 ? remaining.shift()! : rightTop;
    } else {
      // No items left - edge case
      // Create empty tiles (shouldn't happen with normal data)
      rightTop = left;
      rightBottom = left;
    }

    // STEP 4: CREATE PAGE
    const page: PageLayout = {
      left,
      rightTop,
      rightBottom,
    };

    pages.push(page);
  }

  return pages;
}

/**
 * Helper function to verify pages are built correctly
 * Use for testing/debugging
 */
export function debugPages(pages: PageLayout[]): void {
  console.log(`\n=== DEBUG: Built ${pages.length} pages ===`);

  pages.forEach((page, idx) => {
    const leftType = page.left.type;
    const rightTopType = page.rightTop.type;
    const rightBottomType = page.rightBottom.type;

    console.log(
      `Page ${
        idx + 1
      }: LEFT(${leftType}) | RIGHT_TOP(${rightTopType}) RIGHT_BOTTOM(${rightBottomType})`,
    );
  });

  console.log('=== END DEBUG ===\n');
}
