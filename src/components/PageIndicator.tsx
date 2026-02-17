import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
  onPagePress?: (pageIndex: number) => void;
}

const PageIndicator = React.memo(
  ({ currentPage, totalPages, onPagePress }: PageIndicatorProps) => {
    return (
      <View style={styles.container}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, index === currentPage && styles.dotActive]}
            onPress={() => onPagePress?.(index)}
            activeOpacity={0.6}
          />
        ))}
      </View>
    );
  },
);

PageIndicator.displayName = 'PageIndicator';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width: 12,
    height: 8,
    backgroundColor: '#fff',
  },
});

export default PageIndicator;
