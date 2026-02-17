/**
 * Screen wrapper for SmartHeroGallery component
 * Can add header, navigation, etc. here
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import SmartHeroGallery from '../components/SmartHeroGallery';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const SmartHeroGalleryScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SmartHeroGallery />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default SmartHeroGalleryScreen;
