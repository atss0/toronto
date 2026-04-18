import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useColors } from '../../context/ThemeContext';
import { wScale, hScale } from '../../styles/Scaler';
import Layout from '../../styles/Layout';

interface SkeletonCardProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = '100%',
  height = hScale(120),
  style,
}) => {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, backgroundColor: colors.cardBackground, opacity },
        style,
      ]}
    />
  );
};

export default SkeletonCard;

const styles = StyleSheet.create({
  base: {
    borderRadius: Layout.borderRadius.md,
  },
});
