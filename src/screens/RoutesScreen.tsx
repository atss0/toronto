import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

import routesData from '../data/routes.json';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const buildWeekDays = (anchorDate: Date) => {
  const result: { dayLabel: string; dayNum: number; isoDate: string }[] = [];
  // Start from Monday of the current week
  const monday = new Date(anchorDate);
  const dow = anchorDate.getDay(); // 0=Sun
  const diff = dow === 0 ? -6 : 1 - dow;
  monday.setDate(anchorDate.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().split('T')[0]; // e.g. "2025-04-17"
    result.push({ dayLabel: DAY_LABELS[i], dayNum: d.getDate(), isoDate: iso });
  }
  return result;
};

// ─── Map Placeholder (SVG-like shapes via Views) ─────────────────────────────

const MapPlaceholder: React.FC<{ colors: AppColors }> = ({ colors }) => (
  <View style={mapStyles.container}>
    {/* Background */}
    <View style={[mapStyles.bg, { backgroundColor: colors.mapBackground ?? '#EFF6FF' }]} />

    {/* Grid blocks (buildings / districts) */}
    {[
      { top: hScale(18), left: wScale(30), w: wScale(38), h: hScale(28) },
      { top: hScale(18), left: wScale(78), w: wScale(52), h: hScale(20) },
      { top: hScale(18), right: wScale(30), w: wScale(32), h: hScale(28) },
      { top: hScale(56), left: wScale(14), w: wScale(50), h: hScale(22) },
      { top: hScale(56), left: wScale(74), w: wScale(44), h: hScale(32) },
      { top: hScale(56), right: wScale(14), w: wScale(46), h: hScale(22) },
      { top: hScale(94), left: wScale(28), w: wScale(60), h: hScale(24) },
      { top: hScale(94), right: wScale(24), w: wScale(56), h: hScale(24) },
      { top: hScale(128), left: wScale(10), w: wScale(42), h: hScale(20) },
      { top: hScale(128), left: wScale(62), w: wScale(68), h: hScale(20) },
      { top: hScale(128), right: wScale(10), w: wScale(36), h: hScale(20) },
    ].map((block, i) => (
      <View
        key={i}
        style={[
          mapStyles.block,
          {
            top: block.top,
            left: (block as any).left,
            right: (block as any).right,
            width: block.w,
            height: block.h,
            backgroundColor: colors.mapGrid ?? '#BFDBFE',
          },
        ]}
      />
    ))}

    {/* Route line */}
    <View style={[mapStyles.routeLineH, { top: hScale(80), backgroundColor: colors.primary }]} />
    <View style={[mapStyles.routeLineV, { left: wScale(120), backgroundColor: colors.primary }]} />

    {/* Stop dots */}
    {[
      { top: hScale(74), left: wScale(50) },
      { top: hScale(74), left: wScale(120) },
      { top: hScale(100), left: wScale(114) },
    ].map((pos, i) => (
      <View
        key={i}
        style={[
          mapStyles.stopDot,
          {
            top: pos.top,
            left: pos.left,
            backgroundColor: i === 1 ? colors.primary : colors.white,
            borderColor: colors.primary,
          },
        ]}
      />
    ))}
  </View>
);

const mapStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: hScale(160),
    borderRadius: wScale(16),
    overflow: 'hidden',
    position: 'relative',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  block: {
    position: 'absolute',
    borderRadius: wScale(4),
    opacity: 0.7,
  },
  routeLineH: {
    position: 'absolute',
    left: wScale(40),
    width: wScale(130),
    height: hScale(3),
    borderRadius: 2,
    opacity: 0.85,
  },
  routeLineV: {
    position: 'absolute',
    top: hScale(80),
    width: hScale(3),
    height: hScale(60),
    borderRadius: 2,
    opacity: 0.85,
  },
  stopDot: {
    position: 'absolute',
    width: wScale(10),
    height: wScale(10),
    borderRadius: wScale(5),
    borderWidth: 2,
  },
});

// ─── Saved Route Row ──────────────────────────────────────────────────────────

interface SavedRoute {
  id: string;
  name: string;
  date: string;
  stops: number;
  duration: string;
  isCompleted: boolean;
  imageUrl: string;
  placeholderColor: string;
}

const SavedRouteRow: React.FC<{ item: SavedRoute; colors: AppColors }> = ({ item, colors }) => {
  const { t } = useTranslation();
  const styles = useMemo(() => makeSavedRowStyles(colors), [colors]);
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.85}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.thumb}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{item.date}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{item.stops} {t('routes.stops')}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{item.duration}</Text>
        </View>
      </View>
      <View style={[styles.statusIcon, item.isCompleted && styles.statusIconCompleted]}>
        <Iconify
          icon={item.isCompleted ? 'solar:check-circle-bold' : 'solar:bookmark-linear'}
          size={wScale(18)}
          color={item.isCompleted ? colors.primary : colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

const makeSavedRowStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(12),
      paddingVertical: hScale(12),
      borderBottomWidth: 1,
      borderBottomColor: colors.stroke,
    },
    thumb: {
      width: wScale(58),
      height: hScale(58),
      borderRadius: wScale(12),
      backgroundColor: colors.cardDark,
    },
    info: {
      flex: 1,
      gap: hScale(5),
    },
    name: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textPrimary,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(5),
    },
    metaText: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textSecondary,
      letterSpacing: 0.3,
    },
    dot: {
      width: wScale(3),
      height: wScale(3),
      borderRadius: wScale(2),
      backgroundColor: colors.textSecondary,
    },
    statusIcon: {
      width: wScale(34),
      height: wScale(34),
      borderRadius: wScale(17),
      backgroundColor: colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusIconCompleted: {
      backgroundColor: colors.primaryLight,
    },
  });

// ─── Main Screen ──────────────────────────────────────────────────────────────

const RoutesScreen = () => {
  const { t } = useTranslation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const today = useMemo(() => new Date(), []);
  const weekDays = useMemo(() => buildWeekDays(today), [today]);
  const [selectedIso, setSelectedIso] = useState(today.toISOString().split('T')[0]);

  const plan = routesData.todaysPlan;
  const saved = routesData.savedRoutes as SavedRoute[];

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.inputBackground}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t('routes.title')}</Text>
            <Text style={styles.subtitle}>{t('routes.subtitle')}</Text>
          </View>
        </View>

        {/* ── Date Strip ──────────────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStrip}
        >
          {weekDays.map(({ dayLabel, dayNum, isoDate }) => {
            const isActive = isoDate === selectedIso;
            return (
              <TouchableOpacity
                key={isoDate}
                style={[styles.dayItem, isActive && styles.dayItemActive]}
                onPress={() => setSelectedIso(isoDate)}
                activeOpacity={0.75}
              >
                <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>
                  {dayLabel}
                </Text>
                <Text style={[styles.dayNum, isActive && styles.dayNumActive]}>
                  {dayNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Today's Plan ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('routes.todaysPlan')}</Text>

          <View style={styles.planCard}>
            {/* Map */}
            <View style={styles.mapWrapper}>
              <MapPlaceholder colors={colors} />
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeBadgeText}>ACTIVE</Text>
              </View>
            </View>

            {/* Route Info */}
            <View style={styles.routeInfoRow}>
              <View style={styles.routeDetails}>
                <Text style={styles.routeName}>{plan.name}</Text>
                <View style={styles.routeMeta}>
                  <Iconify icon="solar:map-point-linear" size={wScale(13)} color={colors.textSecondary} />
                  <Text style={styles.routeMetaText}>{plan.stopsLeft} {t('routes.stopsLeft')}</Text>
                  <View style={styles.metaDot} />
                  <Iconify icon="solar:clock-circle-linear" size={wScale(13)} color={colors.textSecondary} />
                  <Text style={styles.routeMetaText}>{plan.duration}</Text>
                </View>
              </View>
              <View style={styles.walkIconBtn}>
                <Iconify icon="solar:walking-bold" size={wScale(18)} color={colors.primary} />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.continueBtn} activeOpacity={0.85}>
                <Text style={styles.continueBtnText}>{t('routes.continue')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailsBtn} activeOpacity={0.85}>
                <Text style={styles.detailsBtnText}>{t('routes.details')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Saved Routes ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('routes.savedRoutes')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t('routes.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.savedList}>
            {saved.map(item => (
              <SavedRouteRow key={item.id} item={item} colors={colors} />
            ))}
          </View>
        </View>

        {/* ── Create New Route ─────────────────────────────────────────────── */}
        <View style={styles.createSection}>
          <TouchableOpacity style={styles.createBtn} activeOpacity={0.8}>
            <View style={[styles.createIcon, { backgroundColor: colors.primaryLight }]}>
              <Iconify icon="solar:add-circle-linear" size={wScale(20)} color={colors.primary} />
            </View>
            <Text style={styles.createText}>{t('routes.createNew')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default RoutesScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      paddingBottom: hScale(40),
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
      borderBottomWidth: 1,
      borderBottomColor: colors.stroke,
    },
    title: {
      fontSize: wScale(26),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
      marginTop: hScale(3),
    },

    // Date Strip
    dateStrip: {
      paddingHorizontal: Layout.screenPaddingH,
      paddingVertical: hScale(16),
      gap: wScale(6),
      backgroundColor: colors.inputBackground,
    },
    dayItem: {
      width: wScale(46),
      alignItems: 'center',
      paddingVertical: hScale(8),
      borderRadius: wScale(14),
      gap: hScale(4),
    },
    dayItemActive: {
      backgroundColor: colors.primary,
    },
    dayLabel: {
      fontSize: wScale(10),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    dayLabelActive: {
      color: 'rgba(255,255,255,0.75)',
    },
    dayNum: {
      fontSize: wScale(16),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
    },
    dayNumActive: {
      color: '#FFFFFF',
    },

    // Sections
    section: {
      paddingHorizontal: Layout.screenPaddingH,
      marginTop: hScale(24),
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: hScale(14),
    },
    sectionTitle: {
      fontSize: wScale(17),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
      marginBottom: hScale(14),
    },
    seeAll: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.primary,
      letterSpacing: 0.5,
    },

    // Plan Card
    planCard: {
      backgroundColor: colors.white,
      borderRadius: wScale(20),
      padding: wScale(14),
      borderWidth: 1,
      borderColor: colors.stroke,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
      gap: hScale(14),
    },
    mapWrapper: {
      position: 'relative',
    },
    activeBadge: {
      position: 'absolute',
      top: hScale(10),
      left: wScale(10),
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(5),
      backgroundColor: '#10B981',
      paddingHorizontal: wScale(10),
      paddingVertical: hScale(5),
      borderRadius: wScale(10),
    },
    activeDot: {
      width: wScale(6),
      height: wScale(6),
      borderRadius: wScale(3),
      backgroundColor: '#FFFFFF',
    },
    activeBadgeText: {
      fontSize: wScale(10),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
      letterSpacing: 0.8,
    },
    routeInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    routeDetails: {
      gap: hScale(5),
    },
    routeName: {
      fontSize: wScale(16),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.textPrimary,
    },
    routeMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(4),
    },
    routeMetaText: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
    },
    metaDot: {
      width: wScale(3),
      height: wScale(3),
      borderRadius: wScale(2),
      backgroundColor: colors.textSecondary,
      marginHorizontal: wScale(1),
    },
    walkIconBtn: {
      width: wScale(42),
      height: wScale(42),
      borderRadius: wScale(21),
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Action buttons
    actionRow: {
      flexDirection: 'row',
      gap: wScale(10),
    },
    continueBtn: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: wScale(14),
      paddingVertical: hScale(13),
      alignItems: 'center',
    },
    continueBtnText: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
    },
    detailsBtn: {
      flex: 1,
      backgroundColor: colors.white,
      borderRadius: wScale(14),
      paddingVertical: hScale(13),
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.stroke,
    },
    detailsBtnText: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.textPrimary,
    },

    // Saved list
    savedList: {
      marginTop: hScale(-6),
    },

    // Create New Route
    createSection: {
      paddingHorizontal: Layout.screenPaddingH,
      marginTop: hScale(28),
    },
    createBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: wScale(10),
      borderWidth: 1.5,
      borderColor: colors.stroke,
      borderStyle: 'dashed',
      borderRadius: wScale(16),
      paddingVertical: hScale(16),
    },
    createIcon: {
      width: wScale(32),
      height: wScale(32),
      borderRadius: wScale(16),
      alignItems: 'center',
      justifyContent: 'center',
    },
    createText: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textSecondary,
    },
  });
