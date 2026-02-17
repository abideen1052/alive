import {
  CDN_BASE,
  PROCESSED_MOBILE_PREFIX,
  PREVIEW_PREFIX,
} from '../constants';

export function getImageUrl(
  src: string,
  type: 'preview' | 'processed' | 'original',
): string {
  switch (type) {
    case 'preview':
      return `${CDN_BASE}${PREVIEW_PREFIX}${src}`;
    case 'processed':
      return `${CDN_BASE}${PROCESSED_MOBILE_PREFIX}${src}`;
    case 'original':
      return `${CDN_BASE}/${src}`;
    default:
      return `${CDN_BASE}/${src}`;
  }
}

export function getVideoUrl(
  src: string,
  type: 'processed' | 'original',
): string {
  switch (type) {
    case 'processed':
      return `${CDN_BASE}${PROCESSED_MOBILE_PREFIX}${src}`;
    case 'original':
      return `${CDN_BASE}/${src}`;
    default:
      return `${CDN_BASE}/${src}`;
  }
}

export function getThumbnailUrl(
  src: string,
  type: 'preview' | 'processed' | 'original',
): string {
  const webpSrc = src + '.webp';

  switch (type) {
    case 'preview':
      return `${CDN_BASE}${PREVIEW_PREFIX}${webpSrc}`;
    case 'processed':
      return `${CDN_BASE}${PROCESSED_MOBILE_PREFIX}${webpSrc}`;
    case 'original':
      return `${CDN_BASE}/${webpSrc}`;
    default:
      return `${CDN_BASE}/${webpSrc}`;
  }
}
