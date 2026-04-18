import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Iconify } from 'react-native-iconify';

import { wScale, hScale } from '../styles/Scaler';
import Fonts from '../styles/Fonts';

const SplashScreen = () => {
  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        <Iconify icon="solar:map-point-wave-bold" size={wScale(64)} color="#FFFFFF" />
      </View>
      <Text style={styles.appName}>Toronto</Text>
      <Text style={styles.tagline}>Your AI Travel Companion</Text>
      <ActivityIndicator
        style={styles.loader}
        color="rgba(255,255,255,0.7)"
        size="small"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#3182ED',
    alignItems: 'center',
    justifyContent: 'center',
    gap: hScale(12),
  },
  iconWrap: {
    width: wScale(100),
    height: wScale(100),
    borderRadius: wScale(30),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hScale(8),
  },
  appName: {
    fontSize: wScale(36),
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: wScale(15),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: 'rgba(255,255,255,0.75)',
  },
  loader: {
    marginTop: hScale(32),
  },
});
