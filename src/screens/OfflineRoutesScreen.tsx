import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

const OFFLINE_ROUTES = [
  { id: '1', name: 'Historic Peninsula Walk', stops: 8, distance: '6.2 km', size: '14.3 MB', downloaded: '3 days ago' },
  { id: '2', name: 'Bosphorus Coastal Route', stops: 5, distance: '4.8 km', size: '9.7 MB', downloaded: '1 week ago' },
];

const OfflineRoutesScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [routes, setRoutes] = useState(OFFLINE_ROUTES);

  const removeRoute = (id: string) => setRoutes(prev => prev.filter(r => r.id !== id));

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offline Routes</Text>
        <View style={{ width: wScale(36) }} />
      </View>

      <View style={styles.storageCard}>
        <Iconify icon="solar:database-bold" size={wScale(22)} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.storageTitle}>Storage Used</Text>
          <View style={styles.storageBarBg}>
            <View style={[styles.storageBarFill, { width: '24%' }]} />
          </View>
          <Text style={styles.storageSubtitle}>24 MB of 100 MB used</Text>
        </View>
      </View>

      <FlatList
        data={routes}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Iconify icon="solar:cloud-download-linear" size={wScale(48)} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No offline routes</Text>
            <Text style={styles.emptySubtitle}>Download routes to use them without internet</Text>
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
              <Text style={styles.downloadedAt}>Downloaded {item.downloaded}</Text>
            </View>
            <TouchableOpacity onPress={() => removeRoute(item.id)} hitSlop={8}>
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
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  storageCard: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(14),
    marginHorizontal: Layout.screenPaddingH, marginVertical: hScale(14),
    backgroundColor: colors.white, borderRadius: wScale(16), borderWidth: 1, borderColor: colors.stroke, padding: wScale(16),
  },
  storageTitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(6) },
  storageBarBg: { height: hScale(6), backgroundColor: colors.inputBackground, borderRadius: wScale(3), overflow: 'hidden', marginBottom: hScale(4) },
  storageBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: wScale(3) },
  storageSubtitle: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  list: { paddingHorizontal: Layout.screenPaddingH, paddingBottom: hScale(40), gap: hScale(10) },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(12),
    backgroundColor: colors.white, borderRadius: wScale(16), borderWidth: 1, borderColor: colors.stroke, padding: wScale(14),
  },
  cardIcon: {
    width: wScale(48), height: wScale(48), borderRadius: wScale(14),
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(4) },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(4), marginBottom: hScale(3) },
  metaText: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  dot: { width: wScale(3), height: wScale(3), borderRadius: wScale(2), backgroundColor: colors.textSecondary },
  downloadedAt: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  empty: { alignItems: 'center', paddingVertical: hScale(60), gap: hScale(10) },
  emptyTitle: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  emptySubtitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, textAlign: 'center' },
});
