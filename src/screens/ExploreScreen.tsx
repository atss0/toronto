import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '../context/ThemeContext';

const ExploreScreen = () => {
  const colors = useColors();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.textPrimary }}>Explore</Text>
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
