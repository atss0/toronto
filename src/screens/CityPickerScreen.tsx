import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import StackHeader from '../components/StackHeader/StackHeader';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';
import { setLocationName } from '../redux/UserSlice';
import citiesService, { City } from '../services/cities';

interface ListItem {
  type: 'header' | 'city';
  label?: string;
  city?: City;
}

const CityPickerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const currentCity = useSelector((s: RootState) => s.User.locationName) || 'Istanbul';

  const [query, setQuery] = useState('');
  const [popular, setPopular] = useState<City[]>([]);
  const [all, setAll] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCities = useCallback(async (q?: string) => {
    try {
      const res = await citiesService.get(q ? { query: q } : undefined);
      setPopular(res.data.data.popular);
      setAll(res.data.data.all);
    } catch {
      // keep previous data on error
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const onChangeQuery = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length === 0) {
      setSearching(false);
      fetchCities();
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(() => {
      fetchCities(text.trim());
    }, 400);
  };

  const selectCity = (name: string) => {
    dispatch(setLocationName(name));
    navigation.goBack();
  };

  const listData = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    const isSearching = query.trim().length > 0;

    if (!isSearching && popular.length > 0) {
      items.push({ type: 'header', label: t('cityPicker.popularCities') });
      popular.forEach(city => items.push({ type: 'city', city }));
    }

    if (all.length > 0) {
      if (!isSearching) {
        items.push({ type: 'header', label: t('cityPicker.allCities') });
      }
      all.forEach(city => items.push({ type: 'city', city }));
    }

    return items;
  }, [popular, all, query, t]);

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'header') {
      return <Text style={styles.sectionTitle}>{item.label}</Text>;
    }
    const c = item.city!;
    const isSelected = c.name === currentCity;
    return (
      <TouchableOpacity
        style={[styles.cityRow, isSelected && styles.cityRowActive]}
        onPress={() => selectCity(c.name)}
        activeOpacity={0.8}
        accessibilityLabel={`${c.name}, ${c.country}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <View style={[styles.cityIcon, isSelected && styles.cityIconActive]}>
          <Iconify icon="solar:city-bold" size={wScale(18)} color={isSelected ? '#FFF' : colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cityName, isSelected && styles.cityNameActive]}>{c.name}</Text>
          <Text style={styles.countryName}>{c.country}</Text>
        </View>
        {isSelected && (
          <Iconify icon="solar:check-circle-bold" size={wScale(20)} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StackHeader title={t('cityPicker.title')} />

      <View style={styles.searchWrap}>
        <Iconify icon="solar:magnifer-linear" size={wScale(15)} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={onChangeQuery}
          placeholder={t('cityPicker.searchPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          autoFocus
          accessibilityLabel={t('cityPicker.searchPlaceholder')}
        />
        {searching ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : query.length > 0 ? (
          <TouchableOpacity
            onPress={() => onChangeQuery('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <Iconify icon="solar:close-circle-bold" size={wScale(15)} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item, index) =>
            item.type === 'city' ? item.city!.id : `header-${index}`
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Iconify icon="solar:city-linear" size={wScale(40)} color={colors.textSecondary} />
              <Text style={styles.emptyText}>{t('cityPicker.noResults', 'No cities found')}</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default CityPickerScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(8),
    marginHorizontal: Layout.screenPaddingH, marginVertical: hScale(12),
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(12),
  },
  searchInput: { flex: 1, fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary, padding: 0 },
  list: { paddingHorizontal: Layout.screenPaddingH, paddingBottom: hScale(40), gap: hScale(8) },
  sectionTitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary, marginBottom: hScale(4) },
  cityRow: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(12),
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: colors.stroke, padding: wScale(12),
  },
  cityRowActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  cityIcon: {
    width: wScale(40), height: wScale(40), borderRadius: Layout.borderRadius.sm,
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  cityIconActive: { backgroundColor: colors.primary },
  cityName: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary },
  cityNameActive: { color: colors.primary },
  countryName: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  emptyState: { alignItems: 'center', paddingTop: hScale(60), gap: hScale(12) },
  emptyText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
