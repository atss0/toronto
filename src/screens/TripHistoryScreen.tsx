import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
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
import mockData from '../data/mock.json';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TRIPS = mockData.tripHistory;

const TripHistoryScreen = () => {
  const navigation = useNavigation<Nav>();
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const totalKm = TRIPS.reduce((sum, trip) => sum + parseFloat(trip.distance), 0).toFixed(1);
  const totalTrips = TRIPS.length;
  const avgRating = TRIPS.length > 0
    ? (TRIPS.reduce((sum, trip) => sum + trip.rating, 0) / TRIPS.length).toFixed(1)
    : '0';

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <View style={styles.root}>
      <StackHeader title={t('tripHistory.title')} />

      <FlatList
        data={TRIPS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.statsRow}>
            {[
              { icon: 'solar:routing-bold', label: t('tripHistory.trips'), value: String(totalTrips) },
              { icon: 'solar:walking-bold', label: t('tripHistory.distance'), value: `${totalKm} km` },
              { icon: 'solar:star-bold', label: t('tripHistory.avgRating'), value: avgRating },
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
              <View>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <View style={styles.statPill}>
                <Text style={styles.statPillText}>{item.distance}</Text>
              </View>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Iconify key={i} icon="solar:star-bold" size={wScale(9)} color={i <= item.rating ? colors.warning : colors.stroke} />
                ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Iconify icon="solar:routing-linear" size={wScale(48)} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>{t('tripHistory.noTrips')}</Text>
            <Text style={styles.emptySubtitle}>{t('tripHistory.noTripsSub')}</Text>
          </View>
        }
      />
    </View>
  );
};

export default TripHistoryScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
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
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.lg, borderWidth: 1, borderColor: colors.stroke, padding: wScale(14),
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: wScale(12), flex: 1 },
  cardIcon: {
    width: Layout.hitArea.min, height: Layout.hitArea.min, borderRadius: wScale(13),
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  cardName: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(3) },
  cardDate: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  cardRight: { alignItems: 'flex-end', gap: hScale(5) },
  statPill: {
    backgroundColor: colors.primaryLight, borderRadius: Layout.borderRadius.xs,
    paddingHorizontal: wScale(8), paddingVertical: hScale(3),
  },
  statPillText: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },
  ratingRow: { flexDirection: 'row', gap: wScale(2) },
  empty: { alignItems: 'center', paddingVertical: hScale(60), gap: hScale(10) },
  emptyTitle: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  emptySubtitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
