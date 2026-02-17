/**
 * Reusable tile component for single image or video
 * Handles progressive loading, error states, retry
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';
import { GalleryItem } from '../types/gallery';
import { useMediaLoader } from '../hooks/useMediaLoader';
import { COLORS, BORDER_RADIUS } from '../constants';

interface MediaTileProps {
  item: GalleryItem;
  width: number;
  height: number;
  isVisible: boolean; // Controls video playback
  onPress: () => void;
  onVideoError?: () => void;
}

const MediaTile = React.memo(
  ({
    item,
    width,
    height,
    isVisible,
    onPress,
    onVideoError,
  }: MediaTileProps) => {
    const { imageUrl, thumbnailUrl, isLoading, error, retry } =
      useMediaLoader(item);
    const [videoReady, setVideoReady] = useState(false);
    const [videoFailed, setVideoFailed] = useState(false);

    const handleVideoLoad = useCallback(() => {
      setVideoReady(true);
    }, []);

    const handleVideoError = useCallback(() => {
      setVideoFailed(true);
      onVideoError?.();
    }, [onVideoError]);

    const handleRetry = useCallback(() => {
      setVideoFailed(false);
      setVideoReady(false);
      retry();
    }, [retry]);

    // IMAGE TILE
    if (item.type === 'image') {
      return (
        <TouchableOpacity
          style={[styles.tile, { width, height }]}
          onPress={onPress}
          activeOpacity={0.9}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[styles.placeholder, { width: '100%', height: '100%' }]}
            />
          )}

          {isLoading && (
            <ActivityIndicator
              size="small"
              color={COLORS.textLight}
              style={styles.spinner}
            />
          )}

          {error && !isLoading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load</Text>
              <TouchableOpacity style={styles.retryButton} onPress={retry}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    // VIDEO TILE
    return (
      <TouchableOpacity
        style={[styles.tile, { width, height }]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Poster (always visible initially) */}
          {!videoReady && thumbnailUrl && (
            <Image
              source={{ uri: thumbnailUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          )}

          {/* Video (appears when ready) */}
          {!videoFailed && imageUrl && (
            <Video
              source={{ uri: imageUrl }}
              style={StyleSheet.absoluteFill}
              controls={false}
              paused={!isVisible} // CRITICAL: Pause when not visible
              muted={true}
              repeat={true}
              resizeMode="cover"
              poster={thumbnailUrl || undefined}
              onLoad={handleVideoLoad}
              onError={handleVideoError}
            />
          )}
        </View>

        {/* Error Overlay */}
        {videoFailed && (
          <View style={[styles.errorContainer, StyleSheet.absoluteFill]}>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryText}>Tap to Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading Spinner */}
        {isLoading && !videoReady && (
          <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
        )}
      </TouchableOpacity>
    );
  },
);

MediaTile.displayName = 'MediaTile';

const styles = StyleSheet.create({
  tile: {
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
  },
  spinner: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -12,
  },
  errorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS,
  },
  retryText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default MediaTile;
