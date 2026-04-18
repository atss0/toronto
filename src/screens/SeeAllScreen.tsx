import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar, Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { RootStackParamList } from '../types/navigation';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

import homeData from '../data/home.json';
import discoverData from '../data/discover.json';

type RouteT = RouteProp<RootStackParamList, 'SeeAll'>;

const SORT_OPTIONS = ['Recommended', 'Rating', 'Distance', 'Newest'];

const SeeAllScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const { title, type } = route.params;
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Recommended');

  const rawItems = useMemo(() => {
    if (type === 'nearbyGems') return homeData.nearbyGems;
    if (type === 'trending') return homeData.trending;
    if (type === 'explore') return discoverData.allResults;
    return homeData.trending;
  }, [type]);

  const items = useMemo(() => {
    if (!search.trim()) return rawItems;
    const q = search.toLowerCase();
    return rawItems.filter((i: any) =>
      i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
    );
  }, [rawItems, search]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: wScale(36) }} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Iconify icon="solar:magnifer-linear" size={wScale(16)} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
            <Iconify icon="solar:close-circle-bold" size={wScale(16)} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort */}
      <View style={styles.sortWrap}>
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.sortChip, opt === sort && styles.sortChipActive]}
            onPress={() => setSort(opt)}
            activeOpacity={0.8}
          >
            <Text style={[styles.sortLabel, opt === sort && styles.sortLabelActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => (navigation as any).navigate('PlaceDetail', {
              placeId: item.id,
              name: item.name,
              category: item.category,
              rating: item.rating,
              imageUrl: item.imageUrl,
              distance: item.distance,
              price: item.price,
              reviewCount: item.reviewCount,
            })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.thumb} resizeMode="cover" />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <View style={styles.metaRow}>
                <Iconify icon="solar:star-bold" size={wScale(11)} color={colors.warning} />
                <Text style={styles.rating}>{item.rating?.toFixed(1)}</Text>
                {item.distance && (
                  <>
                    <View style={styles.dot} />
                    <Text style={styles.metaText}>{item.distance}</Text>
                  </>
                )}
              </View>
            </View>
            <Iconify icon="solar:alt-arrow-right-linear" size={wScale(16)} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Iconify icon="solar:compass-bold" size={wScale(40)} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No results</Text>
          </View>
        }
      />
    </View>
  );
};

export default SeeAllScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(10),
    margin: Layout.screenPaddingH, marginBottom: hScale(8),
    backgroundColor: colors.white, borderRadius: wScale(12), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(10),
  },
  searchInput: { flex: 1, fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary, padding: 0 },
  sortWrap: {
    flexDirection: 'row', gap: wScale(8),
    paddingHorizontal: Layout.screenPaddingH, marginBottom: hScale(12),
  },
  sortChip: {
    paddingHorizontal: wScale(12), paddingVertical: hScale(6),
    backgroundColor: colors.white, borderRadius: wScale(20), borderWidth: 1, borderColor: colors.stroke,
  },
  sortChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sortLabel: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary },
  sortLabelActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: Layout.screenPaddingH, paddingBottom: hScale(40), gap: hScale(10) },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(12),
    backgroundColor: colors.white, borderRadius: wScale(16), borderWidth: 1, borderColor: colors.stroke,
    padding: wScale(12),
  },
  thumb: { width: wScale(66), height: wScale(66), borderRadius: wScale(12), backgroundColor: colors.cardDark },
  info: { flex: 1 },
  name: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(2) },
  category: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginBottom: hScale(5) },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(4) },
  rating: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary },
  dot: { width: wScale(3), height: wScale(3), borderRadius: wScale(2), backgroundColor: colors.textSecondary },
  metaText: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  empty: { alignItems: 'center', paddingVertical: hScale(60), gap: hScale(10) },
  emptyTitle: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
});
