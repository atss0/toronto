import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

import discoverData from '../data/discover.json';
import SkeletonCard from '../components/SkeletonCard/SkeletonCard';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrendingItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  badge: string;
  imageUrl: string;
  placeholderColor: string;
}

interface PlaceResult {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  isLiked: boolean;
  imageUrl: string;
  placeholderColor: string;
}

// ─── Map View Placeholder ────────────────────────────────────────────────────

const MAP_PINS = [
  { top: 0.22, left: 0.18, label: 'The Modern Wing',     rating: 4.9 },
  { top: 0.38, left: 0.55, label: 'Green City Gardens',  rating: 4.6 },
  { top: 0.55, left: 0.28, label: "St. Peter's",         rating: 4.8 },
  { top: 0.42, left: 0.74, label: 'Eclipse Bar',         rating: 4.7 },
  { top: 0.68, left: 0.60, label: 'Jazz Lounge',         rating: 4.5 },
];

const ExploreMapView: React.FC<{ colors: AppColors }> = React.memo(({ colors }) => {
  const [activePin, setActivePin] = useState<number | null>(null);
  const mapH = hScale(420);
  const mapW = '100%';

  return (
    <View style={{ height: mapH, width: mapW, position: 'relative' }}>
      {/* Background */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.mapBackground ?? '#EFF6FF', borderRadius: wScale(16) },
        ]}
      />

      {/* Grid blocks */}
      {[
        { top: 0.05, left: 0.06, w: 0.18, h: 0.07 },
        { top: 0.05, left: 0.28, w: 0.24, h: 0.05 },
        { top: 0.05, left: 0.58, w: 0.16, h: 0.07 },
        { top: 0.05, left: 0.78, w: 0.14, h: 0.05 },
        { top: 0.16, left: 0.04, w: 0.22, h: 0.09 },
        { top: 0.16, left: 0.30, w: 0.20, h: 0.08 },
        { top: 0.16, left: 0.56, w: 0.18, h: 0.09 },
        { top: 0.16, left: 0.78, w: 0.16, h: 0.08 },
        { top: 0.30, left: 0.06, w: 0.16, h: 0.08 },
        { top: 0.30, left: 0.28, w: 0.22, h: 0.07 },
        { top: 0.30, left: 0.58, w: 0.20, h: 0.08 },
        { top: 0.30, left: 0.82, w: 0.12, h: 0.07 },
        { top: 0.44, left: 0.04, w: 0.18, h: 0.09 },
        { top: 0.44, left: 0.28, w: 0.24, h: 0.08 },
        { top: 0.44, left: 0.60, w: 0.16, h: 0.09 },
        { top: 0.44, left: 0.80, w: 0.14, h: 0.08 },
        { top: 0.58, left: 0.06, w: 0.20, h: 0.08 },
        { top: 0.58, left: 0.32, w: 0.18, h: 0.07 },
        { top: 0.58, left: 0.56, w: 0.22, h: 0.08 },
        { top: 0.58, left: 0.82, w: 0.12, h: 0.07 },
        { top: 0.72, left: 0.04, w: 0.16, h: 0.08 },
        { top: 0.72, left: 0.26, w: 0.26, h: 0.07 },
        { top: 0.72, left: 0.58, w: 0.18, h: 0.08 },
        { top: 0.72, left: 0.80, w: 0.14, h: 0.07 },
        { top: 0.85, left: 0.06, w: 0.22, h: 0.08 },
        { top: 0.85, left: 0.34, w: 0.20, h: 0.07 },
        { top: 0.85, left: 0.60, w: 0.16, h: 0.08 },
        { top: 0.85, left: 0.80, w: 0.12, h: 0.07 },
      ].map((b, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: b.top * mapH,
            left: `${b.left * 100}%` as any,
            width: `${b.w * 100}%` as any,
            height: b.h * mapH,
            borderRadius: wScale(5),
            backgroundColor: colors.mapGrid ?? '#BFDBFE',
            opacity: 0.65,
          }}
        />
      ))}

      {/* Road lines */}
      {[
        { top: 0.27, horizontal: true },
        { top: 0.42, horizontal: true },
        { top: 0.56, horizontal: true },
        { top: 0.70, horizontal: true },
        { left: 0.26, horizontal: false },
        { left: 0.54, horizontal: false },
        { left: 0.78, horizontal: false },
      ].map((road, i) =>
        road.horizontal ? (
          <View
            key={i}
            style={{
              position: 'absolute',
              top: road.top! * mapH,
              left: 0,
              right: 0,
              height: hScale(2),
              backgroundColor: colors.white,
              opacity: 0.9,
            }}
          />
        ) : (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: `${road.left! * 100}%` as any,
              top: 0,
              bottom: 0,
              width: wScale(2),
              backgroundColor: colors.white,
              opacity: 0.9,
            }}
          />
        ),
      )}

      {/* Pins */}
      {MAP_PINS.map((pin, i) => {
        const isActive = activePin === i;
        return (
          <TouchableOpacity
            key={i}
            activeOpacity={0.85}
            onPress={() => setActivePin(isActive ? null : i)}
            style={{
              position: 'absolute',
              top: pin.top * mapH - hScale(isActive ? 48 : 36),
              left: `${pin.left * 100}%` as any,
              alignItems: 'center',
              zIndex: isActive ? 10 : 1,
            }}
          >
            {isActive && (
              <View
                style={{
                  backgroundColor: colors.white,
                  borderRadius: wScale(10),
                  paddingHorizontal: wScale(8),
                  paddingVertical: hScale(4),
                  marginBottom: hScale(4),
                  borderWidth: 1,
                  borderColor: colors.stroke,
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: wScale(10),
                    fontFamily: Fonts.plusJakartaSansBold,
                    color: colors.textPrimary,
                  }}
                  numberOfLines={1}
                >
                  {pin.label}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: wScale(3), marginTop: hScale(1) }}>
                  <Iconify icon="solar:star-bold" size={wScale(8)} color={colors.warning} />
                  <Text
                    style={{
                      fontSize: wScale(9),
                      fontFamily: Fonts.plusJakartaSansSemiBold,
                      color: colors.textSecondary,
                    }}
                  >
                    {pin.rating}
                  </Text>
                </View>
              </View>
            )}
            <View
              style={{
                width: wScale(isActive ? 32 : 26),
                height: wScale(isActive ? 32 : 26),
                borderRadius: wScale(isActive ? 16 : 13),
                backgroundColor: isActive ? colors.primary : colors.white,
                borderWidth: 2.5,
                borderColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Iconify
                icon="solar:map-point-bold"
                size={wScale(isActive ? 16 : 13)}
                color={isActive ? '#FFFFFF' : colors.primary}
              />
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Zoom controls */}
      <View
        style={{
          position: 'absolute',
          right: wScale(12),
          bottom: hScale(16),
          gap: hScale(2),
        }}
      >
        {['+', '−'].map(label => (
          <TouchableOpacity
            key={label}
            style={{
              width: wScale(32),
              height: wScale(32),
              backgroundColor: colors.white,
              borderRadius: wScale(8),
              borderWidth: 1,
              borderColor: colors.stroke,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: wScale(18),
                fontFamily: Fonts.plusJakartaSansBold,
                color: colors.textPrimary,
                lineHeight: wScale(22),
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

// ─── Sub-components ───────────────────────────────────────────────────────────

const TrendingNearCard: React.FC<{ item: TrendingItem; colors: AppColors }> = React.memo(({ item, colors }) => {
  const styles = useMemo(() => makeTrendingCardStyles(colors), [colors]);
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.88}>
      <Image
        source={{ uri: item.imageUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      {item.badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      ) : null}

      <View style={styles.bottom}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Iconify icon="solar:star-bold" size={wScale(10)} color={colors.warning} />
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.category}>{item.category.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const makeTrendingCardStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      width: wScale(160),
      height: hScale(170),
      borderRadius: wScale(16),
      overflow: 'hidden',
      backgroundColor: colors.cardDark,
    },
    overlay: {
      backgroundColor: 'rgba(10,20,40,0.42)',
    },
    badge: {
      position: 'absolute',
      top: hScale(10),
      left: wScale(10),
      backgroundColor: colors.warning,
      paddingHorizontal: wScale(8),
      paddingVertical: hScale(3),
      borderRadius: wScale(6),
    },
    badgeText: {
      fontSize: wScale(8),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
      letterSpacing: 0.6,
    },
    bottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: wScale(12),
      paddingBottom: hScale(12),
      gap: hScale(4),
    },
    name: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
      lineHeight: hScale(18),
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(4),
    },
    rating: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: '#FFFFFF',
    },
    category: {
      fontSize: wScale(9),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: 'rgba(255,255,255,0.55)',
      letterSpacing: 0.5,
    },
  });

// ─── Result List Item ──────────────────────────────────────────────────────────

const PlaceRow: React.FC<{
  item: PlaceResult;
  colors: AppColors;
  onToggleLike: (id: string) => void;
  onPress: () => void;
}> = React.memo(({ item, colors, onToggleLike, onPress }) => {
  const styles = useMemo(() => makeResultItemStyles(colors), [colors]);
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.85} onPress={onPress}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.thumb}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.sub} numberOfLines={1}>{item.category}</Text>
        <View style={styles.meta}>
          <Iconify icon="solar:star-bold" size={wScale(10)} color={colors.warning} />
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          <View style={styles.dot} />
          <Iconify icon="solar:map-point-bold" size={wScale(10)} color={colors.textSecondary} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.bookmarkBtn}
        hitSlop={8}
        onPress={() => onToggleLike(item.id)}
      >
        <Iconify
          icon={item.isLiked ? 'solar:bookmark-bold' : 'solar:bookmark-linear'}
          size={wScale(18)}
          color={item.isLiked ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const makeResultItemStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(12),
      paddingVertical: hScale(10),
      borderBottomWidth: 1,
      borderBottomColor: colors.stroke,
    },
    thumb: {
      width: wScale(62),
      height: hScale(62),
      borderRadius: wScale(12),
      backgroundColor: colors.cardDark,
    },
    info: {
      flex: 1,
      gap: hScale(3),
    },
    name: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textPrimary,
    },
    sub: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(4),
    },
    rating: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textPrimary,
    },
    dot: {
      width: wScale(3),
      height: wScale(3),
      borderRadius: wScale(2),
      backgroundColor: colors.textSecondary,
      marginHorizontal: wScale(1),
    },
    location: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
    },
    bookmarkBtn: {
      padding: wScale(4),
    },
  });

// ─── Main Screen ──────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ExploreScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [results, setResults] = useState<PlaceResult[]>(discoverData.allResults as PlaceResult[]);
  const [isLoading, setIsLoading] = useState(false); // TODO: true when API is wired
  const searchRef = useRef<TextInput>(null);

  const isSearchMode = isSearchFocused || searchText.trim().length > 0;

  const handleToggleLike = (id: string) => {
    setResults(prev =>
      prev.map(r => (r.id === id ? { ...r, isLiked: !r.isLiked } : r)),
    );
  };

  const filteredResults = useMemo(() => {
    let base = activeFilter === 'all'
      ? results
      : results.filter(r => r.category.toLowerCase() === activeFilter.toLowerCase());

    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      base = base.filter(
        r => r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q),
      );
    }
    return base;
  }, [results, activeFilter, searchText]);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.inputBackground}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>{t('explore.eyebrow')}</Text>
            <Text style={styles.title}>{t('explore.title')}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: wScale(8) }}>
            <TouchableOpacity style={styles.bellBtn} hitSlop={8} onPress={() => navigation.navigate('BookmarksSaved')}>
              <Iconify icon="solar:bookmark-linear" size={wScale(20)} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bellBtn} hitSlop={8} onPress={() => navigation.navigate('Notifications')}>
              <Iconify icon="solar:bell-linear" size={wScale(20)} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Search Bar ────────────────────────────────────────────────────── */}
        <View style={styles.searchRow}>
          <View style={[styles.searchBox, isSearchMode && styles.searchBoxActive]}>
            <Iconify icon="solar:magnifer-linear" size={wScale(16)} color={isSearchMode ? colors.primary : colors.textSecondary} />
            <TextInput
              ref={searchRef}
              style={styles.searchInput}
              placeholder={t('explore.searchPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')} hitSlop={8}>
                <Iconify icon="solar:close-circle-bold" size={wScale(16)} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          {isSearchMode ? (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => { setSearchText(''); setIsSearchFocused(false); searchRef.current?.blur(); }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.filterBtn, activeFilter !== 'all' && styles.filterBtnActive]}
              onPress={() => navigation.navigate('Filter')}
            >
              <Iconify icon="solar:filter-bold-duotone" size={wScale(18)} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Filter Chips ──────────────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {discoverData.filters.map(f => {
            const isActive = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setActiveFilter(f.id)}
                activeOpacity={0.8}
              >
                <Iconify
                  icon={f.icon}
                  size={wScale(13)}
                  color={isActive ? '#FFFFFF' : colors.textSecondary}
                />
                <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── View Toggle ───────────────────────────────────────────────────── */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleLabel, viewMode === 'list' && styles.toggleLabelActive]}>
              {t('explore.listView')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
            onPress={() => setViewMode('map')}
          >
            <Text style={[styles.toggleLabel, viewMode === 'map' && styles.toggleLabelActive]}>
              {t('explore.mapView')}
            </Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'map' ? (
          /* ── Map View ──────────────────────────────────────────────────────── */
          <View style={styles.mapViewContainer}>
            <ExploreMapView colors={colors} />
            <View style={styles.mapResultCount}>
              <Iconify icon="solar:map-point-bold" size={wScale(13)} color={colors.primary} />
              <Text style={styles.mapResultCountText}>
                {t('explore.placesOnMap', { count: filteredResults.length })}
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* ── Trending Near You — hidden in search mode ─────────────────── */}
            {!isSearchMode && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('explore.trendingNearYou')}</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('SeeAll', { type: 'explore', title: t('explore.trendingNearYou') })}>
                    <Text style={styles.seeAll}>{t('routes.seeAll')}</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hList}
                >
                  {isLoading
                    ? [1, 2, 3].map(i => <SkeletonCard key={i} width={wScale(160)} height={hScale(170)} style={{ marginRight: wScale(12) }} />)
                    : discoverData.trending.map(item => (
                    <TrendingNearCard
                      key={item.id}
                      item={item as TrendingItem}
                      colors={colors}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ── Results ────────────────────────────────────────────────────── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                {isSearchMode && searchText.trim() ? (
                  <Text style={styles.sectionTitle}>
                    {t('search.resultsFor', { query: searchText.trim() })}
                  </Text>
                ) : (
                  <Text style={styles.sectionTitle}>{t('explore.allResults')}</Text>
                )}
                <Text style={styles.resultCount}>
                  {t('explore.placesFound', { count: filteredResults.length })}
                </Text>
              </View>

              {filteredResults.length === 0 ? (
                <View style={styles.emptyState}>
                  <Iconify icon="solar:compass-bold" size={wScale(40)} color={colors.textSecondary} />
                  <Text style={styles.emptyTitle}>{t('explore.noResults')}</Text>
                  <Text style={styles.emptySubtitle}>{t('explore.noResultsSub')}</Text>
                </View>
              ) : (
                <View style={styles.resultList}>
                  {filteredResults.map(item => (
                    <PlaceRow
                      key={item.id}
                      item={item}
                      colors={colors}
                      onToggleLike={handleToggleLike}
                      onPress={() => navigation.navigate('PlaceDetail', {
                        placeId: item.id,
                        name: item.name,
                        category: item.category,
                        rating: item.rating,
                        imageUrl: item.imageUrl,
                        reviewCount: item.reviewCount,
                        price: item.price,
                      })}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      paddingBottom: hScale(32),
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: Layout.screenPaddingH,
      paddingTop: hScale(20),
      paddingBottom: hScale(16),
      backgroundColor: colors.inputBackground,
    },
    eyebrow: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.primary,
      letterSpacing: 1.2,
      marginBottom: hScale(2),
    },
    title: {
      fontSize: wScale(26),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    bellBtn: {
      width: wScale(42),
      height: wScale(42),
      backgroundColor: colors.white,
      borderRadius: wScale(13),
      borderWidth: 1,
      borderColor: colors.stroke,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hScale(4),
    },

    // Search
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Layout.screenPaddingH,
      paddingVertical: hScale(14),
      backgroundColor: colors.inputBackground,
      gap: wScale(10),
      borderBottomWidth: 1,
      borderBottomColor: colors.stroke,
    },
    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: wScale(12),
      borderWidth: 1,
      borderColor: colors.stroke,
      paddingHorizontal: wScale(12),
      paddingVertical: hScale(10),
      gap: wScale(8),
    },
    searchInput: {
      flex: 1,
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textPrimary,
      padding: 0,
    },
    searchBoxActive: {
      borderColor: colors.primary,
      borderWidth: 1.5,
    },
    filterBtn: {
      width: wScale(44),
      height: wScale(44),
      backgroundColor: colors.primary,
      borderRadius: wScale(12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterBtnActive: {
      backgroundColor: colors.secondary,
    },
    cancelBtn: {
      paddingHorizontal: wScale(4),
      paddingVertical: hScale(10),
      justifyContent: 'center',
    },
    cancelText: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.primary,
    },

    // Filter Chips
    chipsRow: {
      paddingHorizontal: Layout.screenPaddingH,
      paddingVertical: hScale(14),
      gap: wScale(8),
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(5),
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.stroke,
      borderRadius: wScale(20),
      paddingHorizontal: wScale(12),
      paddingVertical: hScale(7),
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipLabel: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textSecondary,
    },
    chipLabelActive: {
      color: '#FFFFFF',
    },

    // View Toggle
    toggleRow: {
      flexDirection: 'row',
      marginHorizontal: Layout.screenPaddingH,
      marginBottom: hScale(20),
      backgroundColor: colors.white,
      borderRadius: wScale(12),
      borderWidth: 1,
      borderColor: colors.stroke,
      padding: wScale(3),
    },
    toggleBtn: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: hScale(9),
      borderRadius: wScale(10),
    },
    toggleBtnActive: {
      backgroundColor: colors.primary,
    },
    toggleLabel: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textSecondary,
    },
    toggleLabelActive: {
      color: '#FFFFFF',
    },

    // Sections
    section: {
      marginBottom: hScale(28),
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Layout.screenPaddingH,
      marginBottom: hScale(14),
    },
    sectionTitle: {
      fontSize: wScale(17),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
    },
    seeAll: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.primary,
    },
    resultCount: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
    },
    hList: {
      paddingLeft: Layout.screenPaddingH,
      paddingRight: Layout.screenPaddingH,
      gap: wScale(12),
    },
    resultList: {
      paddingHorizontal: Layout.screenPaddingH,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: hScale(40),
      paddingHorizontal: Layout.screenPaddingH,
      gap: hScale(10),
    },
    emptyTitle: {
      fontSize: wScale(15),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.textPrimary,
    },
    emptySubtitle: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
      textAlign: 'center',
    },

    // Map View
    mapViewContainer: {
      paddingHorizontal: Layout.screenPaddingH,
      paddingTop: hScale(4),
      paddingBottom: hScale(16),
      gap: hScale(12),
    },
    mapResultCount: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(6),
      alignSelf: 'center',
      backgroundColor: colors.white,
      paddingHorizontal: wScale(14),
      paddingVertical: hScale(8),
      borderRadius: wScale(20),
      borderWidth: 1,
      borderColor: colors.stroke,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    mapResultCountText: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textPrimary,
    },
  });
