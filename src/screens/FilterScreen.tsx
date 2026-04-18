import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView,
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

const CATEGORIES = ['All', 'Museum', 'Historic', 'Nature', 'Shopping', 'Dining', 'Entertainment'];
const DISTANCES = ['< 1 km', '< 5 km', '< 10 km', '< 25 km', 'Any'];
const RATINGS = [4.5, 4.0, 3.5, 3.0];
const PRICES = ['Free', '$', '$$', '$$$'];

const FilterScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
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

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={reset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.chipWrap}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, cat === selectedCategory && styles.chipActive]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, cat === selectedCategory && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Distance</Text>
        <View style={styles.chipWrap}>
          {DISTANCES.map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, d === selectedDistance && styles.chipActive]}
              onPress={() => setSelectedDistance(d)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, d === selectedDistance && styles.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Minimum Rating</Text>
        <View style={styles.ratingRow}>
          {RATINGS.map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.ratingBtn, minRating === r && styles.ratingBtnActive]}
              onPress={() => setMinRating(minRating === r ? 0 : r)}
              activeOpacity={0.8}
            >
              <Iconify icon="solar:star-bold" size={wScale(12)} color={minRating === r ? '#FFF' : '#F59E0B'} />
              <Text style={[styles.ratingBtnText, minRating === r && styles.ratingBtnTextActive]}>{r}+</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.chipWrap}>
          {PRICES.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.chip, selectedPrices.includes(p) && styles.chipActive]}
              onPress={() => togglePrice(p)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, selectedPrices.includes(p) && styles.chipTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.applyBtnText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  resetText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },
  content: { paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(20), paddingBottom: hScale(20) },
  sectionTitle: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, marginBottom: hScale(12) },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: wScale(8) },
  chip: {
    paddingHorizontal: wScale(16), paddingVertical: hScale(8),
    backgroundColor: colors.white, borderRadius: wScale(20), borderWidth: 1, borderColor: colors.stroke,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary },
  chipTextActive: { color: '#FFFFFF' },
  divider: { height: 1, backgroundColor: colors.stroke, marginVertical: hScale(20) },
  ratingRow: { flexDirection: 'row', gap: wScale(10) },
  ratingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(5),
    paddingHorizontal: wScale(16), paddingVertical: hScale(8),
    backgroundColor: colors.white, borderRadius: wScale(20), borderWidth: 1, borderColor: colors.stroke,
  },
  ratingBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  ratingBtnText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary },
  ratingBtnTextActive: { color: '#FFFFFF' },
  footer: {
    paddingHorizontal: Layout.screenPaddingH, paddingVertical: hScale(16),
    borderTopWidth: 1, borderTopColor: colors.stroke, backgroundColor: colors.white,
  },
  applyBtn: {
    backgroundColor: colors.primary, borderRadius: wScale(16), paddingVertical: hScale(15), alignItems: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  applyBtnText: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF' },
});
