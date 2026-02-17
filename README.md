# Smart Hero Gallery (Alive)

A high-performance, horizontally scrollable hero gallery built with React Native.

## Setup Instructions

1. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

2. **iOS Setup** (macOS only):

   ```bash
   cd ios && pod install && cd ..
   ```

3. **Run the app**:
   - **Android**: `npm run android`
   - **iOS**: `npm run ios`

## Implementation Details

### buildPages Logic

The `buildPages` function is a deterministic pure function that transforms the flat gallery array into a structured list of pages.

- **One Video Per Page**: The algorithm scans a `lookahead` window (default 12) to find the video closest to the 9:16 aspect ratio.
- **Order Preservation**: Items are processed in their API order. Reordering only occurs to pull the "best" video forward from the lookahead window.
- **Page Structure**: Each page is a 2-column block with 1 hero tile and 2 stacked tiles.

### Progressive Loading & Fallbacks

- **Images**: We use a chain of `Image.prefetch` calls: `preview` -> `processed` -> `original`. If the higher-quality version fails, the UI stays on the successful lower-quality version.
- **Videos**:
  - **Poster**: We load the poster using the same `preview` -> `processed` -> `original` chain.
  - **Video File**: We attempt the `processed` mobile video first. If the `react-native-video` component reports an error, we catch it and automatically switch the source to the `original` video URL.
  - **Retry**: If all video sources fail, a "Tap to Retry" overlay is shown.

### Performance Optimizations

- **FlatList Tuning**: Used `pagingEnabled`, `snapToInterval`, and `getItemLayout` for precise, native-feeling scrolling. `windowSize` and `initialNumToRender` are optimized for media-heavy lists.
- **Memoization**: `GalleryPage` and `MediaTile` are wrapped in `React.memo` with stable callbacks to prevent unnecessary re-renders.
- **Viewability Control**: `onViewableItemsChanged` triggers a 25% visibility threshold. Videos are only `paused={false}` when their page is visible, saving CPU and battery.
- **Asset Prefetching**: Thumbnails are prefetched to ensure posters are ready before the user even reaches the page.

### Smart Cover Rule

Media items use `resizeMode="cover"` within containers of specific aspect ratios. The `SmartHeroGallery` calculates Column 1 as a tall hero and Column 2 as two equal squares/rectangles. This ensures that only one axis is cropped significantly while the other fills the tile, preserving the "hero" feel without awkward blank spaces.

### Features

- **Nudge**: A subtle arrow on Page 1 scrolls the user forward.
- **Modal**: Full-screen carousel with horizontal navigation to view media in full detail.
- **Page Indicator**: Dots at the bottom for quick navigation.

## Future Improvements

- **Animated Nudge**: Add a subtle bounce animation to the scroll hint.
- **Video Prefetching**: Implement a more advanced buffer management for videos (e.g., pre-loading the next video file once current is 50% through).
- **Dynamic Gaps**: Allowing users to customize tile spacing via a settings menu.
- **Swipe for Modal**: Allow swiping down to close the full-screen modal.
