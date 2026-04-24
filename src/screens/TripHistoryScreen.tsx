import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
  ActivityIndicator, Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types/navigation';
import StackHeader from '../components/StackHeader/StackHeader';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import tripsService from '../services/trips';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface TripItem {
  id: string;
  name: string;
  date: string;
  duration: string;
  distanceKm: number;
  stopCount: number;
  rating: number;
}

interface TripStats {
  totalTrips: number;
  totalDistanceKm: number;
  averageRating: number;
}

interface RateState {
  tripId: string;
  tripName: string;
  selected: number;
}

const mapTrip = (t: any): TripItem => ({
  id: t.id,
  name: t.name,
  date: t.date,
  duration: t.duration,
  distanceKm: t.distance_km ?? 0,
  stopCount: t.stop_count ?? 0,
  rating: t.rating ?? 0,
});

const TripHistoryScreen = () => {
  const navigation = useNavigation<Nav>();
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [trips, setTrips] = useState<TripItem[]>([]);
  const [stats, setStats] = useState<TripStats | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rateState, setRateState] = useState<RateState | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const fetchTrips = useCallback(async (p: number, append: boolean) => {
    try {
      const res = await tripsService.getAll({ page: p, limit: 20 });
      const d = res.data.data;
      const mapped = (d.trips ?? []).map(mapTrip);
      setTrips(prev => append ? [...prev, ...mapped] : mapped);
      setHasNext(res.data.pagination?.hasNext ?? false);
      setPage(p);
      if (!append && d.stats) {
        setStats({
          totalTrips: d.stats.total_trips,
          totalDistanceKm: d.stats.total_distance_km,
          averageRating: d.stats.average_rating,
        });
      }
    } catch {
      // keep existing state on error
    }
  }, []);

  useEffect(() => {
    fetchTrips(1, false).finally(() => setIsInitialLoading(false));
  }, [fetchTrips]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchTrips(1, false);
    setIsRefreshing(false);
  }, [fetchTrips]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasNext) return;
    setIsLoadingMore(true);
    await fetchTrips(page + 1, true);
    setIsLoadingMore(false);
  }, [isLoadingMore, hasNext, page, fetchTrips]);

  const openRatingModal = useCallback((trip: TripItem) => {
    setRateState({ tripId: trip.id, tripName: trip.name, selected: trip.rating });
  }, []);

  const handleSubmitRating = useCallback(async () => {
    if (!rateState || rateState.selected === 0) return;
    setIsSubmittingRating(true);
    try {
      await tripsService.rate(rateState.tripId, rateState.selected);
      setTrips(prev => prev.map(item =>
        item.id === rateState.tripId ? { ...item, rating: rateState.selected } : item,
      ));
      setRateState(null);
    } catch {
      // keep modal open on error so user can retry
    } finally {
      setIsSubmittingRating(false);
    }
  }, [rateState]);

  const displayStats = {
    totalTrips: stats ? String(stats.totalTrips) : String(trips.length),
    totalDistanceKm: stats ? stats.totalDistanceKm.toFixed(1) : '0',
    avgRating: stats ? stats.averageRating.toFixed(1) : '0',
  };

  return (
    <View style={styles.root}>
      <StackHeader title={t('tripHistory.title')} />

      {isInitialLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          removeClippedSubviews
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
          }
          ListHeaderComponent={
            <View style={styles.statsRow}>
              {[
                { icon: 'solar:routing-bold', label: t('tripHistory.trips'), value: displayStats.totalTrips },
                { icon: 'solar:walking-bold', label: t('tripHistory.distance'), value: `${displayStats.totalDistanceKm} km` },
                { icon: 'solar:star-bold', label: t('tripHistory.avgRating'), value: displayStats.avgRating },
              ].map(s => (
                <View key={s.label} style={styles.statBox}>
                  <Iconify icon={s.icon} size={wScale(20)} color={colors.primary} />
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('RouteDetail', { name: item.name })}
              accessibilityLabel={`${item.name}, ${item.date}`}
              accessibilityRole="button"
            >
              <View style={styles.cardLeft}>
                <View style={styles.cardIcon}>
                  <Iconify icon="solar:routing-bold" size={wScale(20)} color={colors.primary} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cardMeta}>{item.date} · {item.duration}</Text>
                </View>
              </View>
              <View style={styles.cardRight}>
                <View style={styles.statPill}>
                  <Text style={styles.statPillText}>{item.distanceKm} km</Text>
                </View>
                <TouchableOpacity
                  style={styles.ratingRow}
                  onPress={() => openRatingModal(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                  accessibilityLabel={`Rate ${item.name}`}
                  accessibilityRole="button"
                >
                  {[1, 2, 3, 4, 5].map(i => (
                    <Iconify
                      key={i}
                      icon="solar:star-bold"
                      size={wScale(10)}
                      color={i <= item.rating ? colors.warning : colors.stroke}
                    />
                  ))}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            isLoadingMore
              ? <ActivityIndicator color={colors.primary} style={{ paddingVertical: hScale(16) }} />
              : hasNext
                ? (
                  <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore} activeOpacity={0.8}>
                    <Text style={styles.loadMoreText}>{t('common.loadMore')}</Text>
                  </TouchableOpacity>
                )
                : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Iconify icon="solar:routing-linear" size={wScale(48)} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>{t('tripHistory.noTrips')}</Text>
              <Text style={styles.emptySubtitle}>{t('tripHistory.noTripsSub')}</Text>
            </View>
          }
        />
      )}

      {/* Rating Modal */}
      <Modal visible={!!rateState} transparent animationType="fade" onRequestClose={() => setRateState(null)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setRateState(null)}>
          <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
            <Text style={styles.modalTitle}>{t('tripHistory.rateTrip')}</Text>
            <Text style={styles.modalSubtitle} numberOfLines={1}>{rateState?.tripName}</Text>
            <View style={styles.modalStars}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setRateState(s => s ? { ...s, selected: i } : null)}
                  hitSlop={10}
                  accessibilityLabel={`${i} star`}
                  accessibilityRole="button"
                >
                  <Iconify
                    icon="solar:star-bold"
                    size={wScale(36)}
                    color={rateState && i <= rateState.selected ? colors.warning : colors.stroke}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setRateState(null)}>
                <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, (!rateState?.selected || isSubmittingRating) && styles.confirmBtnDisabled]}
                onPress={handleSubmitRating}
                disabled={!rateState?.selected || isSubmittingRating}
              >
                {isSubmittingRating
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.confirmBtnText}>{t('common.confirm')}</Text>}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default TripHistoryScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(40), gap: hScale(10) },

  statsRow: {
    flexDirection: 'row', backgroundColor: colors.white,
    borderRadius: Layout.borderRadius.xl, borderWidth: 1, borderColor: colors.stroke,
    padding: wScale(16), marginBottom: hScale(8),
  },
  statBox: { flex: 1, alignItems: 'center', gap: hScale(4) },
  statValue: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary },
  statLabel: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },

  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.lg,
    borderWidth: 1, borderColor: colors.stroke, padding: wScale(14),
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: wScale(12), flex: 1 },
  cardIcon: {
    width: Layout.hitArea.min, height: Layout.hitArea.min, borderRadius: wScale(13),
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(3) },
  cardMeta: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  cardRight: { alignItems: 'flex-end', gap: hScale(5), marginLeft: wScale(8) },
  statPill: {
    backgroundColor: colors.primaryLight, borderRadius: Layout.borderRadius.xs,
    paddingHorizontal: wScale(8), paddingVertical: hScale(3),
  },
  statPillText: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },
  ratingRow: { flexDirection: 'row', gap: wScale(2) },

  loadMoreBtn: {
    alignItems: 'center', paddingVertical: hScale(14),
    marginTop: hScale(4),
  },
  loadMoreText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },

  empty: { alignItems: 'center', paddingVertical: hScale(60), gap: hScale(10) },
  emptyTitle: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  emptySubtitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },

  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center', padding: wScale(32),
  },
  modalCard: {
    backgroundColor: colors.white, borderRadius: Layout.borderRadius['2xl'],
    padding: wScale(24), width: '100%', alignItems: 'center', gap: hScale(16),
  },
  modalTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary },
  modalSubtitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  modalStars: { flexDirection: 'row', gap: wScale(10), paddingVertical: hScale(4) },
  modalActions: { flexDirection: 'row', gap: wScale(12), width: '100%' },
  cancelBtn: {
    flex: 1, paddingVertical: hScale(13), borderRadius: Layout.borderRadius.lg,
    backgroundColor: colors.inputBackground, alignItems: 'center',
    borderWidth: 1, borderColor: colors.stroke,
  },
  cancelBtnText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.textSecondary },
  confirmBtn: {
    flex: 1, paddingVertical: hScale(13), borderRadius: Layout.borderRadius.lg,
    backgroundColor: colors.primary, alignItems: 'center',
  },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmBtnText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF' },
});
