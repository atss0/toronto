import React, { useState, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, StatusBar, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Iconify } from 'react-native-iconify';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import storage from '../storage';
import { RootState } from '../redux/store';
import { setLocationName } from '../redux/UserSlice';

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDE_META = [
  { id: '1', icon: 'solar:map-point-wave-bold', iconColor: '#3182ED', iconBg: '#EBF3FE', titleKey: 'onboarding.slide1Title', subtitleKey: 'onboarding.slide1Subtitle' },
  { id: '2', icon: 'solar:map-arrow-right-bold', iconColor: '#10B981', iconBg: '#D1FAE5', titleKey: 'onboarding.slide2Title', subtitleKey: 'onboarding.slide2Subtitle' },
  { id: '3', icon: 'solar:star-bold', iconColor: '#F59E0B', iconBg: '#FEF3C7', titleKey: 'onboarding.slide3Title', subtitleKey: 'onboarding.slide3Subtitle' },
  { id: '4', icon: 'solar:compass-bold', iconColor: '#8B5CF6', iconBg: '#EDE9FE', titleKey: 'onboarding.slide4Title', subtitleKey: 'onboarding.slide4Subtitle' },
];

const POPULAR_CITIES = ['Paris', 'London', 'Tokyo', 'New York', 'Rome', 'Barcelona', 'Istanbul', 'Amsterdam', 'Dubai', 'Singapore'];

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const OnboardingScreen = () => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch();
  const colors = useColors();
  const { t } = useTranslation();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const SLIDES = useMemo(() => SLIDE_META.map(s => ({ ...s, title: t(s.titleKey), subtitle: t(s.subtitleKey) })), [t]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else if (!showCityPicker) {
      setShowCityPicker(true);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    dispatch(setLocationName(selectedCity || 'Paris'));
    storage.set('onboardingComplete', 'true');
    navigation.navigate('Login');
  };

  const skipOnboarding = () => {
    dispatch(setLocationName('Paris'));
    storage.set('onboardingComplete', 'true');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={skipOnboarding}>
        <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
      </TouchableOpacity>

      {showCityPicker ? (
        /* City picker step */
        <View style={styles.cityStep}>
          <View style={[styles.slideIcon, { backgroundColor: '#EBF3FE' }]}>
            <Iconify icon="solar:city-bold" size={wScale(64)} color="#3182ED" />
          </View>
          <Text style={styles.slideTitle}>Where are you heading?</Text>
          <Text style={styles.slideSubtitle}>Pick your destination so we can personalize your experience from the start.</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cityChips}
          >
            {POPULAR_CITIES.map(city => (
              <TouchableOpacity
                key={city}
                style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
                onPress={() => setSelectedCity(city)}
                activeOpacity={0.8}
              >
                <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>{city}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {selectedCity ? (
            <Text style={styles.citySelectedHint}>Exploring: {selectedCity} ✓</Text>
          ) : (
            <Text style={styles.citySelectedHint}>No preference? We'll start with Paris.</Text>
          )}
        </View>
      ) : (
        /* Slides */
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
      )}

      {/* Dots */}
      {!showCityPicker && (
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
      {showCityPicker && <View style={{ height: hScale(32) }} />}

      {/* Next / Get Started */}
      <TouchableOpacity style={styles.nextBtn} onPress={goNext} activeOpacity={0.85}>
        <Text style={styles.nextBtnText}>
          {showCityPicker
            ? t('onboarding.getStarted')
            : currentIndex < SLIDES.length - 1
              ? t('onboarding.next')
              : t('onboarding.next')}
        </Text>
        <Iconify
          icon={showCityPicker ? 'solar:map-point-wave-bold' : 'solar:arrow-right-linear'}
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

  // City picker step
  cityStep: {
    flex: 1,
    width: SCREEN_W,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wScale(32),
    gap: hScale(16),
  },
  cityChips: {
    paddingHorizontal: wScale(4),
    gap: wScale(8),
    paddingVertical: hScale(4),
  },
  cityChip: {
    paddingHorizontal: wScale(16),
    paddingVertical: hScale(9),
    borderRadius: wScale(20),
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.stroke,
  },
  cityChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cityChipText: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: colors.textSecondary,
  },
  cityChipTextActive: {
    color: '#FFFFFF',
  },
  citySelectedHint: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
