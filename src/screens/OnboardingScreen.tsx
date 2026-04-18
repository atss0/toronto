import React, { useState, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import storage from '../storage';
import { RootState } from '../redux/store';

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'solar:map-point-wave-bold',
    iconColor: '#3182ED',
    iconBg: '#EBF3FE',
    title: 'Discover Hidden Gems',
    subtitle: 'Explore unique places and off-the-beaten-path destinations curated just for you.',
  },
  {
    id: '2',
    icon: 'solar:map-arrow-right-bold',
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
    title: 'AI-Powered Routes',
    subtitle: 'Let Belen, your AI travel assistant, build personalized routes in seconds.',
  },
  {
    id: '3',
    icon: 'solar:star-bold',
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    title: 'Save & Share Trips',
    subtitle: 'Bookmark your favorite places and share your adventures with friends.',
  },
  {
    id: '4',
    icon: 'solar:compass-bold',
    iconColor: '#8B5CF6',
    iconBg: '#EDE9FE',
    title: 'Ready to Explore?',
    subtitle: 'Your next great adventure is just a tap away. Let\'s get started!',
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    storage.set('onboardingComplete', 'true');
    navigation.navigate('Login' as never);
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={finishOnboarding}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.slideIcon, { backgroundColor: item.iconBg }]}>
              <Iconify icon={item.icon} size={wScale(64)} color={item.iconColor} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Next / Get Started */}
      <TouchableOpacity style={styles.nextBtn} onPress={goNext} activeOpacity={0.85}>
        <Text style={styles.nextBtnText}>
          {currentIndex < SLIDES.length - 1 ? 'Next' : 'Get Started'}
        </Text>
        <Iconify
          icon={currentIndex < SLIDES.length - 1 ? 'solar:arrow-right-linear' : 'solar:map-point-wave-bold'}
          size={wScale(18)}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <View style={{ height: hScale(32) }} />
    </View>
  );
};

export default OnboardingScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, alignItems: 'center' },

  skipBtn: { alignSelf: 'flex-end', padding: wScale(20), paddingTop: hScale(52) },
  skipText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary },

  slide: {
    width: SCREEN_W,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wScale(40),
    gap: hScale(20),
  },
  slideIcon: {
    width: wScale(140),
    height: wScale(140),
    borderRadius: wScale(44),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hScale(12),
  },
  slideTitle: {
    fontSize: wScale(26),
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: hScale(34),
  },
  slideSubtitle: {
    fontSize: wScale(15),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: hScale(24),
  },

  dotsRow: { flexDirection: 'row', gap: wScale(8), marginBottom: hScale(32) },
  dot: {
    width: wScale(8),
    height: wScale(8),
    borderRadius: wScale(4),
    backgroundColor: colors.stroke,
  },
  dotActive: {
    width: wScale(24),
    backgroundColor: colors.primary,
  },

  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(8),
    backgroundColor: colors.primary,
    borderRadius: wScale(18),
    paddingVertical: hScale(16),
    paddingHorizontal: wScale(36),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    fontSize: wScale(16),
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: '#FFFFFF',
  },
});
