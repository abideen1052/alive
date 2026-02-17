/**
 * All constants - CDN paths, API endpoint, dimensions
 */

import { Dimensions } from 'react-native';

// CDN Configuration
export const CDN_BASE = 'https://cdn.iamalive.app';
export const PROCESSED_MOBILE_PREFIX = '/processed/mobile/';
export const PREVIEW_PREFIX = '/processed/preview/';

// API Configuration
export const API_ENDPOINT =
  'https://dev.iamalive.app/api/destinations/experience/learn-horse-riding-and-trot-down-a-private-forest-trail?fields=gallery';

// Video Aspect Ratio Target
export const TARGET_VIDEO_RATIO = 9 / 16; // 0.5625 (portrait)

// Screen Dimensions
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// Gallery Dimensions
export const PAGE_WIDTH = SCREEN_WIDTH;
export const PAGE_HEIGHT = SCREEN_HEIGHT * 0.65; // 65% of screen height

export const LEFT_COLUMN_WIDTH = PAGE_WIDTH / 2;
export const RIGHT_COLUMN_WIDTH = PAGE_WIDTH / 2;
export const RIGHT_TILE_HEIGHT = PAGE_HEIGHT / 2;

// Lookhead for video selection (preserve order)
export const VIDEO_SELECTION_LOOKAHEAD = 12;

// Colors
export const COLORS = {
  background: '#fff',
  text: '#000',
  textLight: '#666',
  error: '#ff3333',
  border: '#eee',
  overlay: 'rgba(0,0,0,0.7)',
};

// UI Constants
export const BORDER_RADIUS = 8;
export const PADDING = 16;
