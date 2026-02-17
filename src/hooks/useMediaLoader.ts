/**
 * Progressive media loading hook
 * Images: preview → processed → original
 * Videos: poster (all variants) + video URL
 */

import { useState, useEffect, useCallback } from 'react';
import { Image } from 'react-native';
import { GalleryItem, MediaLoadState } from '../types/gallery';
import { getImageUrl, getVideoUrl, getThumbnailUrl } from '../utils/cdnUtils';

interface UseMediaLoaderResult extends MediaLoadState {
  retry: () => void;
}

export function useMediaLoader(item: GalleryItem): UseMediaLoaderResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset state
    setImageUrl(null);
    setThumbnailUrl(null);
    setIsLoading(true);
    setError(null);

    if (item.type === 'image') {
      loadImage();
    } else {
      loadVideo();
    }
  }, [item._id, retryCount]);

  // IMAGE LOADING CHAIN
  const loadImage = async () => {
    try {
      // Step 1: Try preview (fire and forget)
      const previewUrl = getImageUrl(item.src, 'preview');
      Image.prefetch(previewUrl).catch(() => {
        // Preview failed, continue
      });

      // Step 2: Load processed
      const processedUrl = getImageUrl(item.src, 'processed');
      try {
        await Image.prefetch(processedUrl);
        setImageUrl(processedUrl);
        setIsLoading(false);
        setError(null);
        return; // Success!
      } catch (err) {
        // Processed failed, try original
      }

      // Step 3: Fallback to original
      const originalUrl = getImageUrl(item.src, 'original');
      try {
        await Image.prefetch(originalUrl);
        setImageUrl(originalUrl);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError('Failed to load image');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Unexpected error');
      setIsLoading(false);
    }
  };

  // VIDEO LOADING CHAIN
  const loadVideo = async () => {
    try {
      // Load poster first (try all variants)
      const posterUrls = [
        getThumbnailUrl(item.src, 'preview'),
        getThumbnailUrl(item.src, 'processed'),
        getThumbnailUrl(item.src, 'original'),
      ];

      for (const posterUrl of posterUrls) {
        try {
          await Image.prefetch(posterUrl);
          setThumbnailUrl(posterUrl);
          break; // Stop at first success
        } catch (err) {
          // Try next
          continue;
        }
      }

      // Set video URL (don't wait for it)
      const videoUrl = getVideoUrl(item.src, 'processed');
      setImageUrl(videoUrl);

      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to load video');
      setIsLoading(false);
    }
  };

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    imageUrl,
    thumbnailUrl,
    isLoading,
    error,
    retry,
  };
}
