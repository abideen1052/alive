import { GalleryItem, PageLayout } from '../types/gallery';
import { VIDEO_SELECTION_LOOKAHEAD } from '../constants';
import { findBestVideoInWindow } from './aspectRatioUtils';

export function buildPages(
  items: GalleryItem[],
  lookahead: number = VIDEO_SELECTION_LOOKAHEAD,
): PageLayout[] {
  if (!items || items.length === 0) {
    return [];
  }

  const pages: PageLayout[] = [];
  const remaining = [...items];

  while (remaining.length > 0) {
    // Select video for this page
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

    // Fill left column
    let left: GalleryItem;

    if (selectedVideo) {
      left = selectedVideo;
    } else {
      // No video, take first item (should be image)
      left = remaining.shift()!;
    }

    // Fill right column
    let rightTop: GalleryItem;
    let rightBottom: GalleryItem;

    if (remaining.length >= 2) {
      rightTop = remaining.shift()!;
      rightBottom = remaining.shift()!;
    } else if (remaining.length === 1) {
      rightTop = remaining.shift()!;
      rightBottom = remaining.length > 0 ? remaining.shift()! : rightTop;
    } else {
      rightTop = left;
      rightBottom = left;
    }

    // Create page
    const page: PageLayout = {
      left,
      rightTop,
      rightBottom,
    };

    pages.push(page);
  }

  return pages;
}

// export function debugPages(pages: PageLayout[]): void {
//   console.log(`Z=== DEBUG: Built ${pages.length} pages ===`);

//   pages.forEach((page, idx) => {
//     const leftType = page.left.type;
//     const rightTopType = page.rightTop.type;
//     const rightBottomType = page.rightBottom.type;

//     console.log(
//       `Page ${
//         idx + 1
//       }: LEFT(${leftType}) | RIGHT_TOP(${rightTopType}) RIGHT_BOTTOM(${rightBottomType})`,
//     );
//   });

//   console.log('=== END DEBUG ===\n');
// }
