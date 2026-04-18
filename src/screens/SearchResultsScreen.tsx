import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Image, StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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
import discoverData from '../data/discover.json';

type RouteT = RouteProp<RootStackParamList, 'SearchResults'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const SearchResultsScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [query, setQuery] = useState(route.params.query);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const q = query.toLowerCase().trim();
    if (!q) { setResults([]); return; }
    const all = discoverData.allResults as any[];
    setResults(all.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q),
    ));
  }, [query]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />

      {/* Header with embedded search */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Iconify icon="solar:magnifer-linear" size={wScale(15)} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search places..."
            placeholderTextColor={colors.textSecondary}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
              <Iconify icon="solar:close-circle-bold" size={wScale(15)} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Result count */}
      {query.trim().length > 0 && (
        <View style={styles.resultBanner}>
          <Text style={styles.resultText}>
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PlaceDetail', {
              placeId: item.id,
              name: item.name,
              category: item.category,
              rating: item.rating,
              imageUrl: item.imageUrl,
              reviewCount: item.reviewCount,
              price: item.price,
            })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.thumb} resizeMode="cover" />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <View style={styles.metaRow}>
                <Iconify icon="solar:star-bold" size={wScale(11)} color="#F59E0B" />
                <Text style={styles.rating}>{item.rating?.toFixed(1)}</Text>
                {item.location && (
                  <>
                    <View style={styles.dot} />
                    <Iconify icon="solar:map-point-linear" size={wScale(10)} color={colors.textSecondary} />
                    <Text style={styles.location}>{item.location}</Text>
                  </>
                )}
              </View>
            </View>
            <Iconify icon="solar:alt-arrow-right-linear" size={wScale(16)} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.trim().length > 0 ? (
            <View style={styles.empty}>
              <Iconify icon="solar:magnifer-linear" size={wScale(40)} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>Try different keywords or check spelling</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default SearchResultsScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(10),
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: wScale(8),
    backgroundColor: colors.white, borderRadius: wScale(12), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(12), paddingVertical: hScale(10),
  },
  searchInput: { flex: 1, fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary, padding: 0 },
  resultBanner: { paddingHorizontal: Layout.screenPaddingH, paddingVertical: hScale(10) },
  resultText: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary },
  list: { paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(8), paddingBottom: hScale(40), gap: hScale(10) },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(12),
    backgroundColor: colors.white, borderRadius: wScale(16), borderWidth: 1, borderColor: colors.stroke, padding: wScale(12),
  },
  thumb: { width: wScale(62), height: wScale(62), borderRadius: wScale(12), backgroundColor: colors.cardDark },
  info: { flex: 1 },
  name: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(2) },
  category: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginBottom: hScale(4) },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(4) },
  rating: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary },
  dot: { width: wScale(3), height: wScale(3), borderRadius: wScale(2), backgroundColor: colors.textSecondary },
  location: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  empty: { alignItems: 'center', paddingVertical: hScale(60), gap: hScale(10) },
  emptyTitle: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  emptySubtitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, textAlign: 'center' },
});
