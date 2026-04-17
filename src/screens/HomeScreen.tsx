import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  LayoutChangeEvent,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Iconify } from 'react-native-iconify';

import { RootState } from '../redux/store';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';

import SectionHeader from '../components/SectionHeader';
import HeroCard from '../components/HeroCard';
import GemCard from '../components/GemCard';
import OngoingJourneyCard from '../components/OngoingJourneyCard';
import TrendingCard from '../components/TrendingCard';
import QuickActions from '../components/QuickActions';

import homeData from '../data/home.json';

// ─── Yardımcı ─────────────────────────────────────────────────────────────────

const getGreetingKey = (): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' => {
  const h = new Date().getHours();
  if (h < 12) return 'greetingMorning';
  if (h < 18) return 'greetingAfternoon';
  return 'greetingEvening';
};

const WEATHER = {
  temp: 21,
  icon: 'solar:sun-bold-duotone',
};

// ─── Ekran ─────────────────────────────────────────────────────────────────────

const HomeScreen = () => {
  const { t } = useTranslation();
  const user = useSelector((s: RootState) => s.User.user);
  const locationName = useSelector((s: RootState) => s.User.locationName);
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const firstName = user?.name ?? 'Traveler';
  const city = locationName || 'İstanbul';
  const greetingKey = getGreetingKey();
  const initials = user?.name
    ? `${user.name[0]}${user.surname?.[0] ?? ''}`.toUpperCase()
    : 'T';

  // ── Animated sticky header ──────────────────────────────────────────────────
  const scrollY = useRef(new Animated.Value(0)).current;
  const [fullHeaderH, setFullHeaderH] = useState(hScale(150));

  const onFullHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    setFullHeaderH(e.nativeEvent.layout.height);
  }, []);

  // Header scroll-off noktasından 70px önce başlar, 10px önce tamamlanır
  const triggerStart = fullHeaderH - 70;
  const triggerEnd   = fullHeaderH - 10;

  const compactOpacity = useMemo(() =>
    scrollY.interpolate({
      inputRange: [triggerStart, triggerEnd],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }), [triggerStart, triggerEnd]);

  // Header yukarıdan kayarak iner
  const compactTranslateY = useMemo(() =>
    scrollY.interpolate({
      inputRange: [triggerStart, triggerEnd],
      outputRange: [-hScale(66), 0],
      extrapolate: 'clamp',
    }), [triggerStart, triggerEnd]);

  // Sol içerik (lokasyon + selamlama) soldan kayar
  const leftSlideX = useMemo(() =>
    scrollY.interpolate({
      inputRange: [triggerStart, triggerEnd],
      outputRange: [-wScale(18), 0],
      extrapolate: 'clamp',
    }), [triggerStart, triggerEnd]);

  // Sağ içerik (hava + zil + avatar) sağdan kayar
  const rightSlideX = useMemo(() =>
    scrollY.interpolate({
      inputRange: [triggerStart, triggerEnd],
      outputRange: [wScale(18), 0],
      extrapolate: 'clamp',
    }), [triggerStart, triggerEnd]);

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.inputBackground}
      />

      {/* ── Compact Sticky Header ─────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.compactHeader,
          { opacity: compactOpacity, transform: [{ translateY: compactTranslateY }] },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.compactInner}>

          {/* Sol: lokasyon + selamlama (soldan kayar) */}
          <Animated.View style={[styles.compactLeft, { transform: [{ translateX: leftSlideX }] }]}>
            <View style={styles.compactLocationRow}>
              <Iconify icon="solar:map-point-bold" size={wScale(11)} color={colors.primary} />
              <Text style={styles.compactCity} numberOfLines={1}>{city}</Text>
            </View>
            <Text style={styles.compactGreeting} numberOfLines={1}>
              {t(`header.${greetingKey}`)},{' '}
              <Text style={styles.compactName}>{firstName}</Text>
            </Text>
          </Animated.View>

          {/* Sağ: hava durumu + zil + avatar (sağdan kayar) */}
          <Animated.View style={[styles.compactRight, { transform: [{ translateX: rightSlideX }] }]}>
            <View style={[styles.compactWeatherPill, { backgroundColor: colors.warningLight }]}>
              <Iconify icon={WEATHER.icon} size={wScale(13)} color={colors.warning} />
              <Text style={styles.compactWeatherText}>{WEATHER.temp}°</Text>
            </View>
            <TouchableOpacity style={styles.compactIconBtn} hitSlop={8}>
              <Iconify icon="solar:bell-linear" size={wScale(17)} color={colors.textPrimary} />
            </TouchableOpacity>
          </Animated.View>

        </View>
      </Animated.View>

      {/* ── ScrollView ─────────────────────────────────────────────────────── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {/* ── Full Header ──────────────────────────────────────────────────── */}
        <View style={styles.fullHeader} onLayout={onFullHeaderLayout}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.locationChip} activeOpacity={0.75}>
              <Iconify icon="solar:map-point-bold" size={wScale(13)} color={colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>{city}</Text>
              <Iconify icon="solar:alt-arrow-down-bold" size={wScale(11)} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <View style={[styles.weatherChip, { backgroundColor: colors.warningLight }]}>
                <Iconify icon={WEATHER.icon} size={wScale(16)} color={colors.warning} />
                <Text style={styles.weatherTemp}>{WEATHER.temp}°C</Text>
              </View>
              <TouchableOpacity style={styles.iconBtn} hitSlop={8}>
                <Iconify icon="solar:bell-linear" size={wScale(20)} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={styles.greetingLine}>{t(`header.${greetingKey}`)},</Text>
            <Text style={styles.greetingName}>{firstName}</Text>
            <Text style={styles.greetingSubtitle}>{t('header.subtitle')}</Text>
          </View>
        </View>

        {/* ── İçerik ───────────────────────────────────────────────────────── */}

        {/* Hero + Quick Actions */}
        <View style={styles.heroSection}>
          <HeroCard
            title={homeData.hero.title}
            subtitle={homeData.hero.subtitle}
            imageSource={{ uri: homeData.hero.imageUrl }}
            onViewRoute={() => {}}
            onSave={() => {}}
          />
        </View>

        <View style={styles.quickActionsSection}>
          <QuickActions />
        </View>

        {/* Nearby Gems */}
        <View style={styles.section}>
          <SectionHeader title={t('home.nearbyGems')} onPressSeeAll={() => {}} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
          >
            {homeData.nearbyGems.map(gem => (
              <GemCard
                key={gem.id}
                name={gem.name}
                category={gem.category}
                distance={gem.distance}
                rating={gem.rating}
                imageSource={{ uri: gem.imageUrl }}
                placeholderColor={gem.placeholderColor}
                onPress={() => {}}
              />
            ))}
          </ScrollView>
        </View>

        {/* Ongoing Journey */}
        <View style={styles.section}>
          <SectionHeader title={t('home.ongoingJourney')} showSeeAll={false} />
          <View style={styles.padH}>
            <OngoingJourneyCard
              title={homeData.ongoingJourney.title}
              description={homeData.ongoingJourney.description}
              remaining={homeData.ongoingJourney.remaining}
              totalStops={homeData.ongoingJourney.totalStops}
              duration={homeData.ongoingJourney.duration}
              distance={homeData.ongoingJourney.distance}
              progress={homeData.ongoingJourney.progress}
              isActive={homeData.ongoingJourney.isActive}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Trending Today */}
        <View style={styles.section}>
          <SectionHeader title={t('home.trendingToday')} onPressSeeAll={() => {}} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
          >
            {homeData.trending.map(item => (
              <TrendingCard
                key={item.id}
                name={item.name}
                category={item.category}
                rating={item.rating}
                reviewCount={item.reviewCount}
                price={item.price}
                imageSource={{ uri: item.imageUrl }}
                placeholderColor={item.placeholderColor}
                onPress={() => {}}
              />
            ))}
          </ScrollView>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default HomeScreen;

// ─── Stiller ──────────────────────────────────────────────────────────────────

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // ── Compact Header ──────────────────────────────────────────────────────────
  compactHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 10,
  },
  compactInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: hScale(10),
  },

  // Sol kolon: lokasyon satırı + selamlama satırı
  compactLeft: {
    flex: 1,
    gap: hScale(3),
    marginRight: wScale(10),
  },
  compactLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(3),
  },
  compactCity: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  compactGreeting: {
    fontSize: wScale(14),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textPrimary,
  },
  compactName: {
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: colors.primary,
  },

  // Sağ kolon: hava + zil + avatar
  compactRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(8),
  },
  compactWeatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(4),
    paddingHorizontal: wScale(9),
    paddingVertical: hScale(5),
    borderRadius: wScale(20),
  },
  compactWeatherText: {
    fontSize: wScale(12),
    fontFamily: Fonts.plusJakartaSansBold,
    color: colors.warning,
  },
  compactIconBtn: {
    width: wScale(30),
    height: wScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ── Full Header ─────────────────────────────────────────────────────────────
  fullHeader: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: hScale(16),
    paddingBottom: hScale(24),
    gap: hScale(20),
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(5),
    backgroundColor: colors.white,
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(7),
    borderRadius: wScale(20),
    borderWidth: 1,
    borderColor: colors.stroke,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    maxWidth: wScale(150),
  },
  locationText: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(10),
  },
  iconBtn: {
    width: wScale(42),
    height: wScale(42),
    backgroundColor: colors.white,
    borderRadius: wScale(13),
    borderWidth: 1,
    borderColor: colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  weatherChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(4),
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(7),
    borderRadius: wScale(20),
  },
  weatherTemp: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: colors.textPrimary,
  },
  greetingLine: {
    fontSize: wScale(28),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textPrimary,
    lineHeight: hScale(36),
    letterSpacing: -0.3,
  },
  greetingName: {
    fontSize: wScale(28),
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: colors.textPrimary,
    lineHeight: hScale(36),
    letterSpacing: -0.3,
    marginBottom: hScale(6),
  },
  greetingSubtitle: {
    fontSize: wScale(14),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary,
    lineHeight: hScale(20),
  },

  // ── İçerik Bölümleri ────────────────────────────────────────────────────────
  heroSection: {
    paddingHorizontal: Layout.screenPaddingH,
    marginTop: hScale(20),
    marginBottom: hScale(20),
  },
  quickActionsSection: {
    paddingHorizontal: Layout.screenPaddingH,
    marginBottom: hScale(28),
  },
  section: {
    marginBottom: hScale(32),
  },
  padH: {
    paddingHorizontal: Layout.screenPaddingH,
  },
  hList: {
    paddingLeft: Layout.screenPaddingH,
    paddingRight: Layout.screenPaddingH,
    gap: wScale(12),
  },
});
