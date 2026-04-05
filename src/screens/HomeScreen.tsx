import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  LayoutChangeEvent,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Iconify } from 'react-native-iconify';

import { RootState } from '../redux/store';
import Colors from '../styles/Colors';
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

// ─── Ekran ─────────────────────────────────────────────────────────────────────

const HomeScreen = () => {
  const { t } = useTranslation();
  const user = useSelector((s: RootState) => s.User.user);
  const locationName = useSelector((s: RootState) => s.User.locationName);

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

  const compactOpacity = useMemo(() =>
    scrollY.interpolate({
      inputRange: [fullHeaderH - 24, fullHeaderH + 8],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }), [fullHeaderH]);

  const compactTranslateY = useMemo(() =>
    scrollY.interpolate({
      inputRange: [fullHeaderH - 24, fullHeaderH + 8],
      outputRange: [-hScale(52), 0],
      extrapolate: 'clamp',
    }), [fullHeaderH]);

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>

      {/* ── Compact Sticky Header ─────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.compactHeader,
          { opacity: compactOpacity, transform: [{ translateY: compactTranslateY }] },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.compactInner}>
          <View style={styles.compactLocation}>
            <Iconify icon="solar:map-point-bold" size={wScale(12)} color={Colors.primary} />
            <Text style={styles.compactCity} numberOfLines={1}>{city}</Text>
          </View>

          <Text style={styles.compactGreeting} numberOfLines={1}>
            {t(`header.${greetingKey}`)},{' '}
            <Text style={styles.compactName}>{firstName}</Text>
          </Text>

          <View style={styles.compactActions}>
            <TouchableOpacity style={styles.compactIconBtn} hitSlop={8}>
              <Iconify icon="solar:bell-linear" size={wScale(18)} color={Colors.textPrimary} />
              <View style={styles.compactBadge} />
            </TouchableOpacity>
            <View style={styles.compactAvatar}>
              {user?.photo
                ? <Image source={{ uri: user.photo }} style={styles.fill} />
                : (
                  <View style={styles.compactAvatarFallback}>
                    <Text style={styles.compactAvatarInitials}>{initials}</Text>
                  </View>
                )
              }
            </View>
          </View>
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
              <Iconify icon="solar:map-point-bold" size={wScale(13)} color={Colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>{city}</Text>
              <Iconify icon="solar:alt-arrow-down-bold" size={wScale(11)} color={Colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn} hitSlop={8}>
                <Iconify icon="solar:bell-linear" size={wScale(20)} color={Colors.textPrimary} />
                <View style={styles.badge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.avatar} hitSlop={8}>
                {user?.photo
                  ? <Image source={{ uri: user.photo }} style={styles.fill} />
                  : (
                    <View style={styles.avatarFallback}>
                      <Text style={styles.avatarInitials}>{initials}</Text>
                    </View>
                  )
                }
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
            stats={homeData.hero.stats}
            onViewRoute={() => {}}
            onSave={() => {}}
          />
        </View>

        <View style={styles.quickActionsSection}>
          <QuickActions />
        </View>

        {/* Nearby Gems */}
        <View style={styles.section}>
          <SectionHeader title="Nearby Gems" onPressSeeAll={() => {}} />
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
          <SectionHeader title="Ongoing Journey" showSeeAll={false} />
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
          <SectionHeader title="Trending Today" onPressSeeAll={() => {}} />
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

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </View>
  );
};

export default HomeScreen;

// ─── Stiller ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
  },
  fill: {
    width: '100%',
    height: '100%',
  },

  // ── Compact Header ──────────────────────────────────────────────────────────
  compactHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.stroke,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 8,
  },
  compactInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: hScale(11),
    gap: wScale(8),
  },
  compactLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(3),
  },
  compactCity: {
    fontSize: wScale(12),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.textPrimary,
  },
  compactGreeting: {
    flex: 1,
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  compactName: {
    fontFamily: Fonts.plusJakartaSansBold,
    color: Colors.textPrimary,
  },
  compactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(8),
  },
  compactIconBtn: {
    width: wScale(32),
    height: wScale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactBadge: {
    position: 'absolute',
    top: hScale(5),
    right: wScale(5),
    width: wScale(6),
    height: wScale(6),
    borderRadius: wScale(3),
    backgroundColor: Colors.danger,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  compactAvatar: {
    width: wScale(28),
    height: wScale(28),
    borderRadius: wScale(8),
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  compactAvatarFallback: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactAvatarInitials: {
    fontSize: wScale(10),
    fontFamily: Fonts.plusJakartaSansBold,
    color: Colors.primary,
  },

  // ── Full Header ─────────────────────────────────────────────────────────────
  fullHeader: {
    backgroundColor: Colors.inputBackground,
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
    backgroundColor: Colors.white,
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(7),
    borderRadius: wScale(20),
    borderWidth: 1,
    borderColor: Colors.stroke,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    maxWidth: wScale(150),
  },
  locationText: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.textPrimary,
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
    backgroundColor: Colors.white,
    borderRadius: wScale(13),
    borderWidth: 1,
    borderColor: Colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  badge: {
    position: 'absolute',
    top: hScale(9),
    right: wScale(10),
    width: wScale(7),
    height: wScale(7),
    borderRadius: wScale(4),
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.inputBackground,
  },
  avatar: {
    width: wScale(42),
    height: wScale(42),
    borderRadius: wScale(13),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: wScale(14),
    fontFamily: Fonts.plusJakartaSansBold,
    color: Colors.primary,
  },
  greetingLine: {
    fontSize: wScale(28),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textPrimary,
    lineHeight: hScale(36),
    letterSpacing: -0.3,
  },
  greetingName: {
    fontSize: wScale(28),
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: Colors.textPrimary,
    lineHeight: hScale(36),
    letterSpacing: -0.3,
    marginBottom: hScale(6),
  },
  greetingSubtitle: {
    fontSize: wScale(14),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textSecondary,
    lineHeight: hScale(20),
  },

  // ── İçerik Bölümleri ────────────────────────────────────────────────────────
  heroSection: {
    paddingHorizontal: Layout.screenPaddingH,
    marginBottom: hScale(16),
  },
  quickActionsSection: {
    paddingHorizontal: Layout.screenPaddingH,
    marginBottom: hScale(36),
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
  bottomSpacer: {
    height: hScale(32),
  },
});
