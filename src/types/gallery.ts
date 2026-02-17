export interface GalleryItem {
  _id: string;
  type: 'image' | 'video';
  src: string;
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
  globalIndex: number;
}
