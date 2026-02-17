/**
 * All TypeScript interfaces and types for the gallery
 */

export interface GalleryItem {
  _id: string;
  type: 'image' | 'video';
  src: string; // Filename only, not full URL
  alt?: string;
  aspectRatio?: number;
}

export interface PageLayout {
  left: GalleryItem;
  rightTop: GalleryItem;
  rightBottom: GalleryItem;
}

export interface APIResponse {
  data: {
    gallery: GalleryItem[];
  };
}

export interface MediaLoadState {
  imageUrl: string | null;
  thumbnailUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface FullScreenModalItem {
  item: GalleryItem;
  globalIndex: number; // Index in entire gallery (for prev/next navigation)
}
