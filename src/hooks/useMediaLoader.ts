import { useState, useEffect, useCallback } from 'react';
import { Image } from 'react-native';
import { GalleryItem, MediaLoadState } from '../types/gallery';
import { getImageUrl, getVideoUrl, getThumbnailUrl } from '../utils/cdnUtils';

interface UseMediaLoaderResult extends MediaLoadState {
  retry: () => void;
  fallbackToOriginal: () => void;
}

export function useMediaLoader(item: GalleryItem): UseMediaLoaderResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setImageUrl(null);
    setThumbnailUrl(null);
    setIsLoading(true);
    setError(null);

    if (item.type === 'image') {
      loadImage();
    } else {
      loadVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item._id, retryCount]);

  const loadImage = async () => {
    try {
      const previewUrl = getImageUrl(item.src, 'preview');
      Image.prefetch(previewUrl).catch(() => {});

      const processedUrl = getImageUrl(item.src, 'processed');
      try {
        await Image.prefetch(processedUrl);
        setImageUrl(processedUrl);
        setIsLoading(false);
        setError(null);
        return;
      } catch {
        console.log('Processed failed, try original');
      }

      //  Fallback to original
      const originalUrl = getImageUrl(item.src, 'original');
      try {
        await Image.prefetch(originalUrl);
        setImageUrl(originalUrl);
        setIsLoading(false);
        setError(null);
      } catch {
        setError('Failed to load image');
        setIsLoading(false);
      }
    } catch {
      setError('Unexpected error');
      setIsLoading(false);
    }
  };

  const loadVideo = async () => {
    try {
      const posterUrls = [
        getThumbnailUrl(item.src, 'preview'),
        getThumbnailUrl(item.src, 'processed'),
        getThumbnailUrl(item.src, 'original'),
      ];

      for (const posterUrl of posterUrls) {
        try {
          await Image.prefetch(posterUrl);
          setThumbnailUrl(posterUrl);
          break;
        } catch {
          continue;
        }
      }
      setImageUrl(getVideoUrl(item.src, 'processed'));
      setIsLoading(false);
      setError(null);
    } catch {
      setError('Failed to load video');
      setIsLoading(false);
    }
  };

  const fallbackToOriginal = useCallback(() => {
    if (item.type === 'video') {
      setImageUrl(getVideoUrl(item.src, 'original'));
    }
  }, [item.src, item.type]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    imageUrl,
    thumbnailUrl,
    isLoading,
    error,
    retry,
    fallbackToOriginal,
  };
}
