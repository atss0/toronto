import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TRIPS = [
  { id: '1', name: 'Historic Peninsula Walk', date: 'April 10, 2025', duration: '2h 15m', distance: '6.2 km', stops: 8, rating: 5 },
  { id: '2', name: 'Bosphorus Coastal Route', date: 'March 28, 2025', duration: '1h 48m', distance: '4.8 km', stops: 5, rating: 4 },
  { id: '3', name: 'Asian Side Discovery', date: 'March 14, 2025', duration: '3h 02m', distance: '8.4 km', stops: 10, rating: 5 },
  { id: '4', name: 'Grand Bazaar Circuit', date: 'February 21, 2025', duration: '1h 30m', distance: '2.6 km', stops: 4, rating: 3 },
];

const TripHistoryScreen = () => {
  const navigation = useNavigation<Nav>();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const totalKm = TRIPS.reduce((sum, t) => sum + parseFloat(t.distance), 0).toFixed(1);
  const totalTrips = TRIPS.length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip History</Text>
        <View style={{ width: wScale(36) }} />
      </View>

      <FlatList
        data={TRIPS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.statsRow}>
            {[
              { icon: 'solar:routing-bold', label: 'Trips', value: String(totalTrips) },
              { icon: 'solar:walking-bold', label: 'Distance', value: `${totalKm} km` },
              { icon: 'solar:star-bold', label: 'Avg Rating', value: '4.3' },
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
                  <Iconify key={i} icon="solar:star-bold" size={wScale(9)} color={i <= item.rating ? '#F59E0B' : colors.stroke} />
                ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Iconify icon="solar:routing-linear" size={wScale(48)} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptySubtitle}>Start a route to see your history</Text>
          </View>
        }
      />
    </View>
  );
};

export default TripHistoryScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  list: { paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(40), gap: hScale(10) },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.white,
    borderRadius: wScale(18), borderWidth: 1, borderColor: colors.stroke,
    padding: wScale(16), marginBottom: hScale(8),
  },
  statBox: { flex: 1, alignItems: 'center', gap: hScale(4) },
  statValue: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary },
  statLabel: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white, borderRadius: wScale(16), borderWidth: 1, borderColor: colors.stroke, padding: wScale(14),
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: wScale(12), flex: 1 },
  cardIcon: {
    width: wScale(44), height: wScale(44), borderRadius: wScale(13),
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  cardName: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(3) },
  cardDate: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  cardRight: { alignItems: 'flex-end', gap: hScale(5) },
  statPill: {
    backgroundColor: colors.primaryLight, borderRadius: wScale(8),
    paddingHorizontal: wScale(8), paddingVertical: hScale(3),
  },
  statPillText: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },
  ratingRow: { flexDirection: 'row', gap: wScale(2) },
  empty: { alignItems: 'center', paddingVertical: hScale(60), gap: hScale(10) },
  emptyTitle: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  emptySubtitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
