import { Dimensions } from 'react-native';

// CDN Configuration
export const CDN_BASE = 'https://cdn.iamalive.app';
export const PROCESSED_MOBILE_PREFIX = '/processed/mobile/';
export const PREVIEW_PREFIX = '/processed/preview/';

// API Configuration
export const API_ENDPOINT =
  'https://dev.iamalive.app/api/destinations/experience/learn-horse-riding-and-trot-down-a-private-forest-trail?fields=gallery';

// Video Aspect Ratio Target
export const TARGET_VIDEO_RATIO = 9 / 16;

// Screen Dimensions
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// Gallery Dimensions
export const PAGE_WIDTH = SCREEN_WIDTH;
export const PAGE_HEIGHT = SCREEN_HEIGHT;

// UI Constants
export const BORDER_RADIUS = 12;
export const PADDING = 10;
export const TILE_GAP = 8;

export const LEFT_COLUMN_WIDTH = (PAGE_WIDTH - PADDING * 2 - TILE_GAP) / 2;
export const RIGHT_COLUMN_WIDTH = (PAGE_WIDTH - PADDING * 2 - TILE_GAP) / 2;
export const LEFT_TILE_HEIGHT = PAGE_HEIGHT - PADDING * 2;
export const RIGHT_TILE_HEIGHT = (PAGE_HEIGHT - PADDING * 2 - TILE_GAP) / 2;

// Lookhead for video selection (preserve order)
export const VIDEO_SELECTION_LOOKAHEAD = 12;

export const COLORS = {
  background: '#ffffffff',
  text: '#1a1a1a',
  textLight: '#8e8e93',
  error: '#ff3b30',
  border: '#e5e5ea',
  overlay: 'rgba(0,0,0,0.85)',
};
