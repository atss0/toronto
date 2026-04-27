import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Share,
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
import routesService from '../services/routes';

type RouteT = RouteProp<RootStackParamList, 'RouteDetail'>;

interface StopItem {
  id: string;
  name: string;
  description: string;
  duration: string;
  status: 'upcoming' | 'active' | 'completed';
  order_index: number;
}


type Nav = NativeStackNavigationProp<RootStackParamList>;

const RouteDetailScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { name, routeId } = route.params;
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [stops, setStops] = useState<StopItem[]>([]);
  const [routeDetail, setRouteDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!!routeId);

  useEffect(() => {
    if (!routeId) return;
    setIsLoading(true);
    routesService.getDetail(routeId)
      .then(res => {
        const d = res.data.data;
        setRouteDetail(d);
        setStops(d.stops ?? []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [routeId]);

  const nextStatus = (current: StopItem['status']): StopItem['status'] | null => {
    if (current === 'upcoming') return 'active';
    if (current === 'active') return 'completed';
    return null;
  };

  const handleToggleStop = useCallback(async (stop: StopItem) => {
    if (!routeId) return;
    const next = nextStatus(stop.status);
    if (!next) return;
    setStops(prev => prev.map(s => s.id === stop.id ? { ...s, status: next } : s));
    try {
      await routesService.updateStop(routeId, stop.id, next);
    } catch {
      setStops(prev => prev.map(s => s.id === stop.id ? { ...s, status: stop.status } : s));
    }
  }, [routeId]);

  const displayStops = stops;
  const completed = displayStops.filter(s => s.status === 'completed').length;
  const progress = routeDetail?.progress ?? (displayStops.length > 0 ? completed / displayStops.length : 0);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.inputBackground}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{routeDetail?.name ?? name}</Text>
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() => navigation.navigate('ShareRoute', { routeId: routeId ?? '', routeName: routeDetail?.name ?? name })}
          accessibilityLabel={t('share.title')}
          accessibilityRole="button"
        >
          <Iconify icon="solar:share-linear" size={wScale(20)} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Map Placeholder */}
          <View style={styles.mapCard}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.mapBackground }]} />
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeBadgeText}>{t('routeDetail.activeRoute')}</Text>
            </View>
            <View style={styles.mapCenter}>
              <Iconify icon="solar:route-bold" size={wScale(36)} color={colors.primary} />
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { icon: 'solar:map-point-linear', value: `${routeDetail?.total_stops ?? displayStops.length} ${t('routeDetail.stops').toLowerCase()}`, label: t('routeDetail.totalStops') },
              { icon: 'solar:clock-circle-linear', value: routeDetail?.total_duration ?? '—', label: t('routeDetail.duration') },
              { icon: 'solar:walking-bold', value: routeDetail?.total_distance ?? '—', label: t('routeDetail.distance') },
            ].map(stat => (
              <View key={stat.label} style={styles.statItem}>
                <Iconify icon={stat.icon} size={wScale(18)} color={colors.primary} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Progress */}
          <View style={styles.section}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionTitle}>{t('routeDetail.progress')}</Text>
              <Text style={styles.progressLabel}>{completed}/{displayStops.length} stops</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as any }]} />
            </View>
          </View>

          {/* Stops */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('routeDetail.stops')}</Text>
            {displayStops.map((stop, i) => (
              <TouchableOpacity
                key={stop.id}
                style={styles.stopRow}
                onPress={() => handleToggleStop(stop)}
                activeOpacity={stop.status === 'completed' ? 1 : 0.8}
                accessibilityLabel={`${stop.name} — ${stop.status}`}
                accessibilityRole="button"
              >
                <View style={styles.stopDotCol}>
                  <View style={[
                    styles.stopDot,
                    stop.status === 'completed' && styles.stopDotCompleted,
                    stop.status === 'active' && styles.stopDotActive,
                  ]} />
                  {i < displayStops.length - 1 && <View style={styles.stopLine} />}
                </View>
                <View style={[styles.stopCard, stop.status === 'active' && styles.stopCardActive]}>
                  <View style={styles.stopInfo}>
                    <Text style={styles.stopName}>{stop.name}</Text>
                    <Text style={styles.stopDesc}>{stop.description}</Text>
                    <View style={styles.stopMeta}>
                      <Iconify icon="solar:clock-circle-linear" size={wScale(11)} color={colors.textSecondary} />
                      <Text style={styles.stopDuration}>{stop.duration}</Text>
                    </View>
                  </View>
                  {stop.status === 'completed' && (
                    <Iconify icon="solar:check-circle-bold" size={wScale(22)} color={colors.success} />
                  )}
                  {stop.status === 'active' && (
                    <View style={styles.activeTag}>
                      <Text style={styles.activeTagText}>NOW</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.companionBtn}
          activeOpacity={0.85}
          onPress={() => Share.share({ message: `Join me on "${routeDetail?.name ?? name}" — check it out on Toronto Travel App!`, title: routeDetail?.name ?? name })}
          accessibilityLabel={t('routeDetail.shareWithCompanion')}
          accessibilityRole="button"
        >
          <Iconify icon="solar:users-group-rounded-bold" size={wScale(18)} color={colors.primary} />
          <Text style={styles.companionBtnText}>{t('routeDetail.shareWithCompanion')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Navigation', { routeId: routeId ?? '', routeName: routeDetail?.name ?? name, stops: displayStops })}
          accessibilityLabel={t('routeDetail.startNavigation')}
          accessibilityRole="button"
        >
          <Iconify icon="solar:map-arrow-right-bold" size={wScale(18)} color="#FFFFFF" />
          <Text style={styles.navBtnText}>{t('routeDetail.startNavigation')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RouteDetailScreen;

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Layout.screenPaddingH,
      paddingTop: hScale(16),
      paddingBottom: hScale(14),
      backgroundColor: colors.inputBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.stroke,
    },
    backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
    shareBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: wScale(16),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.textPrimary,
      marginHorizontal: wScale(8),
    },

    scroll: { paddingBottom: hScale(40) },

    mapCard: {
      height: hScale(200),
      margin: Layout.screenPaddingH,
      borderRadius: wScale(18),
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.stroke,
    },
    activeBadge: {
      position: 'absolute',
      top: hScale(12),
      left: wScale(12),
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(5),
      backgroundColor: colors.success,
      paddingHorizontal: wScale(10),
      paddingVertical: hScale(5),
      borderRadius: wScale(10),
    },
    activeDot: { width: wScale(6), height: wScale(6), borderRadius: wScale(3), backgroundColor: '#FFFFFF' },
    activeBadgeText: { fontSize: wScale(10), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF', letterSpacing: 0.8 },
    mapCenter: { alignItems: 'center', justifyContent: 'center' },

    statsRow: {
      flexDirection: 'row',
      marginHorizontal: Layout.screenPaddingH,
      backgroundColor: colors.white,
      borderRadius: wScale(16),
      borderWidth: 1,
      borderColor: colors.stroke,
      paddingVertical: hScale(16),
      marginBottom: hScale(24),
    },
    statItem: { flex: 1, alignItems: 'center', gap: hScale(4) },
    statValue: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary },
    statLabel: { fontSize: wScale(10), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary, letterSpacing: 0.5 },

    section: { paddingHorizontal: Layout.screenPaddingH, marginBottom: hScale(24) },
    sectionTitle: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary, marginBottom: hScale(12) },

    progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: hScale(8) },
    progressLabel: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary },
    progressTrack: { height: hScale(8), backgroundColor: colors.stroke, borderRadius: wScale(4), overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: wScale(4) },

    stopRow: { flexDirection: 'row', marginBottom: hScale(4) },
    stopDotCol: { alignItems: 'center', width: wScale(24), marginRight: wScale(12), paddingTop: hScale(16) },
    stopDot: {
      width: wScale(12),
      height: wScale(12),
      borderRadius: wScale(6),
      backgroundColor: colors.stroke,
      borderWidth: 2,
      borderColor: colors.textSecondary,
    },
    stopDotCompleted: { backgroundColor: colors.success, borderColor: colors.success },
    stopDotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    stopLine: { width: 2, flex: 1, minHeight: hScale(24), backgroundColor: colors.stroke, marginTop: hScale(4) },
    stopCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: wScale(14),
      padding: wScale(14),
      borderWidth: 1,
      borderColor: colors.stroke,
      marginBottom: hScale(10),
    },
    stopCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
    stopInfo: { flex: 1 },
    stopName: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(2) },
    stopDesc: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginBottom: hScale(5) },
    stopMeta: { flexDirection: 'row', alignItems: 'center', gap: wScale(4) },
    stopDuration: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary },
    activeTag: {
      backgroundColor: colors.primary,
      paddingHorizontal: wScale(8),
      paddingVertical: hScale(3),
      borderRadius: wScale(6),
    },
    activeTagText: { fontSize: wScale(10), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF', letterSpacing: 0.5 },

    footer: {
      paddingHorizontal: Layout.screenPaddingH,
      paddingVertical: hScale(14),
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.stroke,
      gap: hScale(10),
    },
    companionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: wScale(8),
      backgroundColor: colors.white,
      borderRadius: wScale(16),
      paddingVertical: hScale(12),
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    companionBtnText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary },
    navBtn: {
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
    navBtnText: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF' },
  });
