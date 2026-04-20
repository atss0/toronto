import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useTranslation } from 'react-i18next';

import StackHeader from '../components/StackHeader/StackHeader';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import mockData from '../data/mock.json';

const OfflineRoutesScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [routes, setRoutes] = useState(mockData.offlineRoutes);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const removeRoute = (id: string, name: string) => {
    Alert.alert(
      t('common.delete'),
      `${name}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => setRoutes(prev => prev.filter(r => r.id !== id)),
        },
      ],
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <View style={styles.root}>
      <StackHeader title={t('offlineRoutes.title')} />

      {/* Map tiles notice */}
      <View style={styles.mapTilesNotice}>
        <Iconify icon="solar:map-bold" size={wScale(18)} color="#F59E0B" />
        <Text style={styles.mapTilesText}>Offline map tiles are coming soon. Currently only route data is saved.</Text>
      </View>

      <View style={styles.storageCard}>
        <Iconify icon="solar:database-bold" size={wScale(22)} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.storageTitle}>{t('offlineRoutes.storageUsed')}</Text>
          <View style={styles.storageBarBg}>
            <View style={[styles.storageBarFill, { width: '24%' }]} />
          </View>
          <Text style={styles.storageSubtitle}>24 MB / 100 MB</Text>
        </View>
      </View>

      <FlatList
        data={routes}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Iconify icon="solar:cloud-download-linear" size={wScale(48)} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>{t('offlineRoutes.noRoutes')}</Text>
            <Text style={styles.emptySubtitle}>{t('offlineRoutes.noRoutesSub')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Iconify icon="solar:routing-bold" size={wScale(22)} color={colors.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={styles.metaRow}>
                <Iconify icon="solar:map-point-linear" size={wScale(10)} color={colors.textSecondary} />
                <Text style={styles.metaText}>{item.stops} stops · {item.distance}</Text>
                <View style={styles.dot} />
                <Text style={styles.metaText}>{item.size}</Text>
              </View>
              <Text style={styles.downloadedAt}>{t('offlineRoutes.downloaded', { time: item.downloaded })}</Text>
            </View>
            <TouchableOpacity
              onPress={() => removeRoute(item.id, item.name)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel={`Delete ${item.name}`}
              accessibilityRole="button"
            >
              <Iconify icon="solar:trash-bin-trash-linear" size={wScale(18)} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default OfflineRoutesScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  storageCard: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(14),
    marginHorizontal: Layout.screenPaddingH, marginVertical: hScale(14),
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.lg, borderWidth: 1, borderColor: colors.stroke, padding: wScale(16),
  },
  storageTitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(6) },
  storageBarBg: { height: hScale(6), backgroundColor: colors.inputBackground, borderRadius: wScale(3), overflow: 'hidden', marginBottom: hScale(4) },
  storageBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: wScale(3) },
  storageSubtitle: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  list: { paddingHorizontal: Layout.screenPaddingH, paddingBottom: hScale(40), gap: hScale(10) },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(12),
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.lg, borderWidth: 1, borderColor: colors.stroke, padding: wScale(14),
  },
  cardIcon: {
    width: wScale(48), height: wScale(48), borderRadius: Layout.borderRadius.md,
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(4) },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(4), marginBottom: hScale(3) },
  metaText: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  dot: { width: wScale(3), height: wScale(3), borderRadius: wScale(2), backgroundColor: colors.textSecondary },
  downloadedAt: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  mapTilesNotice: {
    flexDirection: 'row', alignItems: 'flex-start', gap: wScale(10),
    marginHorizontal: Layout.screenPaddingH, marginTop: hScale(12),
    backgroundColor: '#FFFBEB', borderRadius: wScale(12), borderWidth: 1, borderColor: '#FDE68A',
    paddingHorizontal: wScale(14), paddingVertical: hScale(10),
  },
  mapTilesText: {
    flex: 1, fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular,
    color: '#92400E', lineHeight: hScale(18),
  },
  empty: { alignItems: 'center', paddingVertical: hScale(60), gap: hScale(10) },
  emptyTitle: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  emptySubtitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, textAlign: 'center' },
});
