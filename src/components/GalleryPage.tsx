/**
 * Single page component (2-column layout)
 * Left: 1 large tile (hero)
 * Right: 2 stacked tiles (equal height)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GalleryItem } from '../types/gallery';
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  LEFT_COLUMN_WIDTH,
  RIGHT_COLUMN_WIDTH,
  RIGHT_TILE_HEIGHT,
  LEFT_TILE_HEIGHT,
  PADDING,
  TILE_GAP,
} from '../constants';
import MediaTile from './MediaTile';

interface GalleryPageProps {
  left: GalleryItem;
  rightTop: GalleryItem;
  rightBottom: GalleryItem;
  pageIndex: number;
  isVisible: boolean;
  onItemPress: (item: GalleryItem) => void;
  onVideoError?: () => void;
}

const GalleryPage = React.memo(
  ({
    left,
    rightTop,
    rightBottom,
    pageIndex,
    isVisible,
    onItemPress,
    onVideoError,
  }: GalleryPageProps) => {
    return (
      <View
        style={[
          styles.page,
          { width: PAGE_WIDTH, height: PAGE_HEIGHT, padding: PADDING },
        ]}
      >
        {/* LEFT COLUMN - HERO TILE */}
        <View
          style={[
            styles.leftColumn,
            {
              width: LEFT_COLUMN_WIDTH,
              height: LEFT_TILE_HEIGHT,
              marginRight: TILE_GAP,
            },
          ]}
        >
          <MediaTile
            item={left}
            width={LEFT_COLUMN_WIDTH}
            height={LEFT_TILE_HEIGHT}
            isVisible={isVisible}
            onPress={() => onItemPress(left)}
            onVideoError={onVideoError}
          />
        </View>

        {/* RIGHT COLUMN - STACKED TILES */}
        <View
          style={[
            styles.rightColumn,
            { width: RIGHT_COLUMN_WIDTH, height: LEFT_TILE_HEIGHT },
          ]}
        >
          {/* RIGHT TOP */}
          <View
            style={[
              styles.rightTile,
              { height: RIGHT_TILE_HEIGHT, marginBottom: TILE_GAP },
            ]}
          >
            <MediaTile
              item={rightTop}
              width={RIGHT_COLUMN_WIDTH}
              height={RIGHT_TILE_HEIGHT}
              isVisible={isVisible}
              onPress={() => onItemPress(rightTop)}
              onVideoError={onVideoError}
            />
          </View>

          {/* RIGHT BOTTOM */}
          <View style={[styles.rightTile, { height: RIGHT_TILE_HEIGHT }]}>
            <MediaTile
              item={rightBottom}
              width={RIGHT_COLUMN_WIDTH}
              height={RIGHT_TILE_HEIGHT}
              isVisible={isVisible}
              onPress={() => onItemPress(rightBottom)}
              onVideoError={onVideoError}
            />
          </View>
        </View>
      </View>
    );
  },
);

GalleryPage.displayName = 'GalleryPage';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  leftColumn: {
    flexDirection: 'column',
  },
  rightColumn: {
    flexDirection: 'column',
  },
  rightTile: {
    overflow: 'hidden',
  },
});

export default GalleryPage;
