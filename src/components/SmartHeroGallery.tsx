/**
 * Main gallery component
 * Orchestrates everything: API, pages, scroll, modal, etc.
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { GalleryItem, PageLayout } from '../types/gallery';
import { COLORS } from '../constants';
import { useGalleryAPI } from '../hooks/useGalleryAPI';
import { buildPages } from '../utils/buildPages';
import GalleryPage from './GalleryPage';
import ScrollNudge from './ScrollNudge';
import PageIndicator from './PageIndicator';
import FullScreenModal from './FullScreenModal';

interface SmartHeroGalleryProps {
  onItemPress?: (item: GalleryItem) => void;
}

const SmartHeroGallery: React.FC<SmartHeroGalleryProps> = ({ onItemPress }) => {
  const { gallery, loading, error, retry } = useGalleryAPI();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Build pages from gallery
  const pages = useMemo((): PageLayout[] => {
    return gallery.length > 0 ? buildPages(gallery) : [];
  }, [gallery]);

  // Handle item press - open fullscreen modal
  const handleItemPress = useCallback(
    (item: GalleryItem) => {
      const globalIndex = gallery.findIndex(g => g._id === item._id);
      if (globalIndex !== -1) {
        setSelectedItemIndex(globalIndex);
        setFullScreenVisible(true);
        onItemPress?.(item);
      }
    },
    [gallery, onItemPress],
  );

  // Handle viewable items changed - track current page
  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentPageIndex(viewableItems[0].index);
    }
  }, []);

  // Handle nudge button press - scroll to next page
  const handleNudgePress = useCallback(() => {
    if (currentPageIndex < pages.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPageIndex + 1,
        animated: true,
      });
    }
  }, [currentPageIndex, pages.length]);

  // Handle page indicator press - jump to page
  const handlePageIndicatorPress = useCallback((pageIndex: number) => {
    flatListRef.current?.scrollToIndex({
      index: pageIndex,
      animated: true,
    });
  }, []);

  // LOADING STATE
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.textLight} />
        <Text style={styles.loadingText}>Loading gallery...</Text>
      </View>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButtonLarge} onPress={retry}>
          <Text style={styles.retryTextLarge}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // EMPTY STATE
  if (pages.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No images or videos available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Gallery FlatList */}
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={({ item: page, index }) => (
          <GalleryPage
            left={page.left}
            rightTop={page.rightTop}
            rightBottom={page.rightBottom}
            pageIndex={index}
            isVisible={index === currentPageIndex}
            onItemPress={handleItemPress}
          />
        )}
        keyExtractor={(_, index) => `page-${index}`}
        horizontal={true}
        pagingEnabled={true}
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={16}
        maxToRenderPerBatch={2}
        updateCellsBatchingPeriod={50}
        initialNumToRender={3}
        windowSize={10}
        removeClippedSubviews={true}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 60,
          minimumViewTime: 300,
        }}
        showsHorizontalScrollIndicator={false}
      />

      {/* Nudge on Page 1 */}
      <ScrollNudge
        visible={currentPageIndex === 0}
        onPress={handleNudgePress}
      />

      {/* Page Indicator */}
      <PageIndicator
        currentPage={currentPageIndex}
        totalPages={pages.length}
        onPagePress={handlePageIndicatorPress}
      />

      {/* FullScreen Modal */}
      <FullScreenModal
        visible={fullScreenVisible}
        items={gallery}
        initialIndex={selectedItemIndex}
        onClose={() => setFullScreenVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  retryButtonLarge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.error,
    borderRadius: 8,
  },
  retryTextLarge: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SmartHeroGallery;
