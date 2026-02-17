/**
 * Hint button on right edge of Page 1
 * Nudges user to scroll to next page
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS } from '../constants';

interface ScrollNudgeProps {
  visible: boolean;
  onPress: () => void;
}

const ScrollNudge = React.memo(({ visible, onPress }: ScrollNudgeProps) => {
  const [fadeAnim] = useState(new Animated.Value(visible ? 1 : 0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

ScrollNudge.displayName = 'ScrollNudge';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -30,
    zIndex: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  arrow: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default ScrollNudge;
