import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types/navigation';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';
import placesService from '../services/places';

type RouteT = RouteProp<RootStackParamList, 'PlaceDetail'>;

const HOURS = [
  { day: 'Monday – Friday', hours: '09:00 – 22:00' },
  { day: 'Saturday',        hours: '10:00 – 23:00' },
  { day: 'Sunday',          hours: '10:00 – 21:00' },
];

const TAGS = ['Museum', 'Historic', 'Art', 'Culture'];

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const checkIsOpen = (): boolean => {
  const now = new Date();
  const day = now.getDay();
  const cur = now.getHours() * 60 + now.getMinutes();
  const range = day === 0
    ? '10:00 – 21:00'
    : day === 6
    ? '10:00 – 23:00'
    : '09:00 – 22:00';
  const [open, close] = range.split(' – ');
  return cur >= toMinutes(open) && cur < toMinutes(close);
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PlaceDetailScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { placeId, name, category, rating, imageUrl, distance, price, reviewCount } = route.params;
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [isSaved, setIsSaved] = useState(false);
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);

  useEffect(() => {
    placesService.getDetail(placeId)
      .then(res => {
        const d = res.data.data;
        setDetail(d);
        setIsSaved(d.is_bookmarked ?? false);
      })
      .catch(() => {})
      .finally(() => setIsLoadingDetail(false));
  }, [placeId]);

  const handleToggleBookmark = async () => {
    if (isTogglingBookmark) return;
    setIsTogglingBookmark(true);
    const prev = isSaved;
    setIsSaved(!prev);
    Alert.alert('✓', !prev ? t('common.bookmarkAdded') : t('common.bookmarkRemoved'));
    try {
      const res = await placesService.toggleBookmark(placeId);
      setIsSaved(res.data.data.bookmarked);
    } catch {
      setIsSaved(prev);
    } finally {
      setIsTogglingBookmark(false);
    }
  };

  const displayRating = detail?.rating ?? rating;
  const displayReviewCount = detail?.review_count ?? reviewCount;
  const displayIsOpen = detail ? detail.is_open : checkIsOpen();
  const displayTags: string[] = detail?.tags ?? TAGS;
  const displayDescription: string = detail?.description ?? 'A remarkable destination offering an unforgettable experience. Visitors can enjoy stunning views, rich history, and a vibrant atmosphere that captures the essence of the city.';
  const displayAddress: string = detail?.address ?? '123 Example Street';
  const displayHours = detail?.hours ? [
    { day: 'Monday – Friday', hours: (detail.hours.mon_fri ?? '09:00-17:00').replace('-', ' – ') },
    { day: 'Saturday', hours: (detail.hours.saturday ?? '09:00-19:00').replace('-', ' – ') },
    { day: 'Sunday', hours: (detail.hours.sunday ?? '09:00-19:00').replace('-', ' – ') },
  ] : HOURS;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: imageUrl }} style={styles.hero} resizeMode="cover" />
          <View style={styles.heroOverlay} />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityLabel={t('common.goBack')}
            accessibilityRole="button"
          >
            <Iconify icon="solar:alt-arrow-left-bold" size={wScale(20)} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleToggleBookmark}
            accessibilityLabel={isSaved ? t('placeDetail.saved') : t('placeDetail.save')}
            accessibilityRole="button"
          >
            <Iconify icon={isSaved ? 'solar:bookmark-bold' : 'solar:bookmark-linear'} size={wScale(20)} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{detail?.name ?? name}</Text>
            <Text style={styles.heroCategory}>{detail?.category ?? category}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Rating Row */}
          <View style={styles.metaRow}>
            <View style={styles.ratingPill}>
              <Iconify icon="solar:star-bold" size={wScale(13)} color={colors.warning} />
              <Text style={styles.ratingText}>{displayRating.toFixed(1)}</Text>
              {displayReviewCount != null && (
                <Text style={styles.reviewCount}>({displayReviewCount} reviews)</Text>
              )}
            </View>
            {(detail?.address || distance) && (
              <View style={styles.metaPill}>
                <Iconify icon="solar:map-point-linear" size={wScale(13)} color={colors.textSecondary} />
                <Text style={styles.metaPillText}>{distance}</Text>
              </View>
            )}
            {(detail?.price_display || price) && (
              <View style={styles.metaPill}>
                <Iconify icon="solar:dollar-minimalistic-linear" size={wScale(13)} color={colors.textSecondary} />
                <Text style={styles.metaPillText}>{detail?.price_display ?? price}</Text>
              </View>
            )}
          </View>

          {isLoadingDetail ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: hScale(16) }} />
          ) : (
            <>
              {/* Tags */}
              <View style={styles.tagsRow}>
                {displayTags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('placeDetail.about')}</Text>
                <Text style={styles.description}>{displayDescription}</Text>
              </View>

              {/* Location */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('placeDetail.location')}</Text>
                <View style={styles.mapPlaceholder}>
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.mapBackground, borderRadius: wScale(14) }]} />
                  <View style={styles.mapPin}>
                    <Iconify icon="solar:map-point-bold" size={wScale(28)} color={colors.primary} />
                  </View>
                  <Text style={styles.mapAddress}>{displayAddress}</Text>
                </View>
              </View>

              {/* Hours */}
              <View style={styles.section}>
                <View style={styles.hoursTitleRow}>
                  <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>{t('placeDetail.openingHours')}</Text>
                  <View style={[styles.openBadge, { backgroundColor: displayIsOpen ? colors.successLight : colors.dangerLight }]}>
                    <View style={[styles.openDot, { backgroundColor: displayIsOpen ? colors.success : colors.danger }]} />
                    <Text style={[styles.openBadgeText, { color: displayIsOpen ? colors.success : colors.danger }]}>
                      {displayIsOpen ? 'Open Now' : 'Closed'}
                    </Text>
                  </View>
                </View>
                <View style={styles.hoursCard}>
                  {displayHours.map((h, i) => (
                    <View key={h.day} style={[styles.hourRow, i < displayHours.length - 1 && styles.hourBorder]}>
                      <Text style={styles.hourDay}>{h.day}</Text>
                      <Text style={styles.hourTime}>{h.hours}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Contact */}
              {(detail?.phone || detail?.website) && (
                <View style={styles.section}>
                  {detail.phone && (
                    <View style={styles.contactRow}>
                      <Iconify icon="solar:phone-linear" size={wScale(14)} color={colors.textSecondary} />
                      <Text style={styles.contactText}>{detail.phone}</Text>
                    </View>
                  )}
                  {detail.website && (
                    <View style={styles.contactRow}>
                      <Iconify icon="solar:global-linear" size={wScale(14)} color={colors.textSecondary} />
                      <Text style={styles.contactText} numberOfLines={1}>{detail.website}</Text>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.reviewsBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Reviews', { placeId: route.params.placeId, placeName: name, rating })}
        >
          <Iconify icon="solar:star-linear" size={wScale(16)} color={colors.primary} />
          <Text style={styles.reviewsBtnText}>{t('placeDetail.reviews')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addRouteBtn}
          activeOpacity={0.85}
          onPress={() => Alert.alert('✓', t('common.addedToRoute'))}
          accessibilityLabel={t('placeDetail.addToRoute')}
          accessibilityRole="button"
        >
          <Iconify icon="solar:route-bold" size={wScale(18)} color="#FFFFFF" />
          <Text style={styles.addRouteBtnText}>{t('placeDetail.addToRoute')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlaceDetailScreen;

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },

    heroWrap: { width: '100%', height: hScale(300), position: 'relative' },
    hero: { width: '100%', height: '100%' },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    backBtn: {
      position: 'absolute',
      top: Layout.translucentTopOffset,
      left: wScale(16),
      width: Layout.hitArea.backButton,
      height: Layout.hitArea.backButton,
      borderRadius: wScale(20),
      backgroundColor: 'rgba(0,0,0,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveBtn: {
      position: 'absolute',
      top: Layout.translucentTopOffset,
      right: wScale(16),
      width: Layout.hitArea.backButton,
      height: Layout.hitArea.backButton,
      borderRadius: wScale(20),
      backgroundColor: 'rgba(0,0,0,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroInfo: {
      position: 'absolute',
      bottom: hScale(20),
      left: wScale(20),
      right: wScale(20),
    },
    heroName: {
      fontSize: wScale(24),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: '#FFFFFF',
      letterSpacing: -0.3,
      marginBottom: hScale(4),
    },
    heroCategory: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: 'rgba(255,255,255,0.8)',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },

    content: { paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(20), paddingBottom: hScale(20) },

    metaRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(8), marginBottom: hScale(14) },
    ratingPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(4),
      backgroundColor: colors.warningLight,
      paddingHorizontal: wScale(10),
      paddingVertical: hScale(6),
      borderRadius: wScale(20),
    },
    ratingText: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.warning,
    },
    reviewCount: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
    },
    metaPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(4),
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.stroke,
      paddingHorizontal: wScale(10),
      paddingVertical: hScale(6),
      borderRadius: wScale(20),
    },
    metaPillText: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansMedium,
      color: colors.textSecondary,
    },

    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: wScale(8), marginBottom: hScale(24) },
    tag: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: wScale(12),
      paddingVertical: hScale(5),
      borderRadius: wScale(20),
    },
    tagText: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.primary,
    },

    section: { marginBottom: hScale(24) },
    sectionTitle: {
      fontSize: wScale(16),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
      marginBottom: hScale(10),
    },
    description: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
      lineHeight: hScale(22),
    },

    mapPlaceholder: {
      height: hScale(160),
      borderRadius: wScale(14),
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      gap: hScale(8),
      borderWidth: 1,
      borderColor: colors.stroke,
    },
    mapPin: { alignItems: 'center' },
    mapAddress: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansMedium,
      color: colors.textSecondary,
    },

    hoursTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: hScale(10),
    },
    openBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(5),
      paddingHorizontal: wScale(10),
      paddingVertical: hScale(4),
      borderRadius: wScale(20),
    },
    openDot: {
      width: wScale(6),
      height: wScale(6),
      borderRadius: wScale(3),
    },
    openBadgeText: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansBold,
    },
    hoursCard: {
      backgroundColor: colors.white,
      borderRadius: wScale(14),
      borderWidth: 1,
      borderColor: colors.stroke,
      paddingHorizontal: wScale(16),
    },
    hourRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: hScale(12),
    },
    hourBorder: { borderBottomWidth: 1, borderBottomColor: colors.stroke },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(8),
      paddingVertical: hScale(4),
    },
    contactText: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
      flex: 1,
    },
    hourDay: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansMedium,
      color: colors.textPrimary,
    },
    hourTime: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.primary,
    },

    footer: {
      flexDirection: 'row',
      gap: wScale(10),
      paddingHorizontal: Layout.screenPaddingH,
      paddingVertical: hScale(14),
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.stroke,
    },
    reviewsBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wScale(6),
      borderWidth: 1.5, borderColor: colors.primary, borderRadius: wScale(16),
      paddingVertical: hScale(14), paddingHorizontal: wScale(18),
    },
    reviewsBtnText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary },
    addRouteBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: wScale(8),
      backgroundColor: colors.primary,
      borderRadius: wScale(16),
      paddingVertical: hScale(14),
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    addRouteBtnText: {
      fontSize: wScale(15),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
    },
  });
