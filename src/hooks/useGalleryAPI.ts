/**
 * Custom hook to fetch gallery data from API
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { GalleryItem } from '../types/gallery';
import { API_ENDPOINT } from '../constants';

interface UseGalleryAPIResult {
  gallery: GalleryItem[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useGalleryAPI(): UseGalleryAPIResult {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(
          'Z===>1API_ENDPOINT',
          JSON.stringify(API_ENDPOINT, null, 2),
        );
        const response = await axios.get(API_ENDPOINT);
        console.log('Z===>2Response', JSON.stringify(response, null, 2));
        const items = response.data?.data?.gallery;

        if (!items || !Array.isArray(items)) {
          throw new Error('Invalid gallery data format');
        }

        setGallery(items);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load gallery';
        setError(message);
        setGallery([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [retryCount]);

  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  return { gallery, loading, error, retry };
}
