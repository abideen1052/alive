/**
 * Full-screen modal for viewing gallery items
 * Features: carousel navigation, image zoom, no video zoom
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  PanResponder,
  Animated,
} from 'react-native';
import Video from 'react-native-video';
import { GalleryItem } from '../types/gallery';
import { COLORS, BORDER_RADIUS } from '../constants';
import { useMediaLoader } from '../hooks/useMediaLoader';

interface FullScreenModalProps {
  visible: boolean;
  items: GalleryItem[]; // All gallery items in order
  initialIndex: number; // Which item to start with
  onClose: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Image zoom component
const ZoomableImage: React.FC<{
  uri: string;
  onClose: () => void;
}> = ({ uri, onClose }) => {
  const [scale] = useState(new Animated.Value(1));
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDoubleTap = () => {
    const newScale = isZoomed ? 1 : 2;
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
    }).start();
    setIsZoomed(!isZoomed);
  };

  return (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={onClose}
      activeOpacity={1}
    >
      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={handleDoubleTap}
        activeOpacity={0.9}
      >
        <Animated.Image
          source={{ uri }}
          style={[
            styles.fullImage,
            {
              transform: [{ scale }],
            },
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const FullScreenModal: React.FC<FullScreenModalProps> = ({
  visible,
  items,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, items.length]);

  if (!items[currentIndex]) return null;

  const currentItem = items[currentIndex];
  const isImage = currentItem.type === 'image';

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Content */}
        {isImage ? (
          <ImageContent item={currentItem} onClose={onClose} />
        ) : (
          <VideoContent item={currentItem} />
        )}

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Navigation */}
        {currentIndex > 0 && (
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={handlePrevious}
          >
            <Text style={styles.navText}>‹</Text>
          </TouchableOpacity>
        )}

        {currentIndex < items.length - 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.navText}>›</Text>
          </TouchableOpacity>
        )}

        {/* Page Counter */}
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {items.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

// Image content component
const ImageContent: React.FC<{
  item: GalleryItem;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const { imageUrl, isLoading } = useMediaLoader(item);

  return (
    <>
      {isLoading && (
        <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
      )}
      {imageUrl && <ZoomableImage uri={imageUrl} onClose={onClose} />}
    </>
  );
};

// Video content component
const VideoContent: React.FC<{ item: GalleryItem }> = ({ item }) => {
  const { imageUrl, thumbnailUrl } = useMediaLoader(item);

  return (
    <View style={styles.videoContainer}>
      {imageUrl && (
        <Video
          source={{ uri: imageUrl }}
          style={styles.fullVideo}
          controls={true}
          posterResizeMode="contain"
          poster={thumbnailUrl}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  fullImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.8,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  fullVideo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  closeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  navButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  prevButton: {
    left: 20,
    top: '50%',
    marginTop: -30,
  },
  nextButton: {
    right: 20,
    top: '50%',
    marginTop: -30,
  },
  navText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  counter: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS,
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  spinner: {
    position: 'absolute',
    zIndex: 10,
  },
});

export default FullScreenModal;
