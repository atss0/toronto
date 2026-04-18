import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Iconify } from 'react-native-iconify';
import { useTranslation } from 'react-i18next';

import StackHeader from '../components/StackHeader/StackHeader';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';

const CATEGORIES = ['All', 'Museum', 'Historic', 'Nature', 'Shopping', 'Dining', 'Entertainment'];
const DISTANCES = ['< 1 km', '< 5 km', '< 10 km', '< 25 km', 'Any'];
const RATINGS = [4.5, 4.0, 3.5, 3.0];
const PRICES = ['Free', '$', '$$', '$$$'];

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Filter'>;

const FilterScreen = () => {
  const navigation = useNavigation<NavProp>();
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistance, setSelectedDistance] = useState('Any');
  const [minRating, setMinRating] = useState(0);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  const togglePrice = (price: string) =>
    setSelectedPrices(prev =>
      prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price],
    );

  const reset = () => {
    setSelectedCategory('All');
    setSelectedDistance('Any');
    setMinRating(0);
    setSelectedPrices([]);
  };

  const applyFilters = () => {
    // Pass filters back via navigation params
    navigation.navigate('SearchResults', {
      query: '',
      filters: {
        category: selectedCategory,
        distance: selectedDistance,
        minRating,
        prices: selectedPrices,
      },
    });
  };

  const activeFilterCount = [
    selectedCategory !== 'All',
    selectedDistance !== 'Any',
    minRating > 0,
    selectedPrices.length > 0,
  ].filter(Boolean).length;

  return (
    <View style={styles.root}>
      <StackHeader
        title={t('filter.title')}
        rightComponent={
          <TouchableOpacity
            onPress={reset}
            accessibilityLabel={t('filter.reset')}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.resetText}>{t('filter.reset')}</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>{t('filter.category')}</Text>
        <View style={styles.chipWrap}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, cat === selectedCategory && styles.chipActive]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
              accessibilityLabel={`Category: ${cat}`}
              accessibilityRole="button"
              accessibilityState={{ selected: cat === selectedCategory }}
            >
              <Text style={[styles.chipText, cat === selectedCategory && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>{t('filter.distance')}</Text>
        <View style={styles.chipWrap}>
          {DISTANCES.map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, d === selectedDistance && styles.chipActive]}
              onPress={() => setSelectedDistance(d)}
              activeOpacity={0.8}
              accessibilityLabel={`Distance: ${d}`}
              accessibilityRole="button"
              accessibilityState={{ selected: d === selectedDistance }}
            >
              <Text style={[styles.chipText, d === selectedDistance && styles.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>{t('filter.minimumRating')}</Text>
        <View style={styles.ratingRow}>
          {RATINGS.map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.ratingBtn, minRating === r && styles.ratingBtnActive]}
              onPress={() => setMinRating(minRating === r ? 0 : r)}
              activeOpacity={0.8}
              accessibilityLabel={`Minimum rating ${r}`}
              accessibilityRole="button"
              accessibilityState={{ selected: minRating === r }}
            >
              <Iconify icon="solar:star-bold" size={wScale(12)} color={minRating === r ? '#FFF' : colors.warning} />
              <Text style={[styles.ratingBtnText, minRating === r && styles.ratingBtnTextActive]}>{r}+</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>{t('filter.priceRange')}</Text>
        <View style={styles.chipWrap}>
          {PRICES.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.chip, selectedPrices.includes(p) && styles.chipActive]}
              onPress={() => togglePrice(p)}
              activeOpacity={0.8}
              accessibilityLabel={`Price: ${p}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedPrices.includes(p) }}
            >
              <Text style={[styles.chipText, selectedPrices.includes(p) && styles.chipTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={applyFilters}
          activeOpacity={0.85}
          accessibilityLabel={t('filter.applyFilters')}
          accessibilityRole="button"
        >
          <Text style={styles.applyBtnText}>
            {t('filter.applyFilters')}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  resetText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },
  content: { paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(20), paddingBottom: hScale(20) },
  sectionTitle: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, marginBottom: hScale(12) },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: wScale(8) },
  chip: {
    paddingHorizontal: wScale(16), paddingVertical: hScale(8),
    backgroundColor: colors.white, borderRadius: Layout.borderRadius['2xl'], borderWidth: 1, borderColor: colors.stroke,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary },
  chipTextActive: { color: '#FFFFFF' },
  divider: { height: 1, backgroundColor: colors.stroke, marginVertical: hScale(20) },
  ratingRow: { flexDirection: 'row', gap: wScale(10) },
  ratingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(5),
    paddingHorizontal: wScale(16), paddingVertical: hScale(8),
    backgroundColor: colors.white, borderRadius: Layout.borderRadius['2xl'], borderWidth: 1, borderColor: colors.stroke,
  },
  ratingBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  ratingBtnText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary },
  ratingBtnTextActive: { color: '#FFFFFF' },
  footer: {
    paddingHorizontal: Layout.screenPaddingH, paddingVertical: hScale(16),
    borderTopWidth: 1, borderTopColor: colors.stroke, backgroundColor: colors.white,
  },
  applyBtn: {
    backgroundColor: colors.primary, borderRadius: Layout.borderRadius.lg, paddingVertical: hScale(15), alignItems: 'center',
    ...Layout.shadow.md,
    shadowColor: colors.primary,
  },
  applyBtnText: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF' },
});
