import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

const INTERESTS = [
  { id: 'nature', label: 'Nature', icon: 'solar:leaf-bold', color: '#10B981', bg: '#D1FAE5' },
  { id: 'food', label: 'Food & Dining', icon: 'solar:chef-hat-bold', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'history', label: 'History', icon: 'solar:buildings-bold', color: '#8B5CF6', bg: '#EDE9FE' },
  { id: 'art', label: 'Art & Culture', icon: 'solar:pallete-2-bold', color: '#EF4444', bg: '#FFE4E6' },
  { id: 'shopping', label: 'Shopping', icon: 'solar:bag-bold', color: '#3182ED', bg: '#EBF3FE' },
  { id: 'nightlife', label: 'Nightlife', icon: 'solar:moon-bold', color: '#6366F1', bg: '#EEF2FF' },
  { id: 'sports', label: 'Sports', icon: 'solar:running-bold', color: '#14B8A6', bg: '#CCFBF1' },
  { id: 'wellness', label: 'Wellness & Spa', icon: 'material-symbols:spa', color: '#EC4899', bg: '#FCE7F3' },
  { id: 'photography', label: 'Photography', icon: 'solar:camera-bold', color: '#0EA5E9', bg: '#E0F2FE' },
  { id: 'music', label: 'Music & Events', icon: 'solar:music-note-bold', color: '#F97316', bg: '#FFEDD5' },
];

const InterestsScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [selected, setSelected] = useState<string[]>(['nature', 'food']);

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interests</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>Select your interests to get personalized recommendations</Text>

        <View style={styles.grid}>
          {INTERESTS.map(item => {
            const isSelected = selected.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, isSelected && styles.chipSelected, isSelected && { borderColor: item.color }]}
                onPress={() => toggle(item.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.chipIcon, { backgroundColor: item.bg }]}>
                  <Iconify icon={item.icon} size={wScale(22)} color={item.color} />
                </View>
                <Text style={[styles.chipLabel, isSelected && { color: item.color }]}>{item.label}</Text>
                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: item.color }]}>
                    <Iconify icon="solar:check-circle-bold" size={wScale(9)} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.selectedCount}>{selected.length} selected</Text>
      </ScrollView>
    </View>
  );
};

export default InterestsScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  saveText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary },
  scroll: { padding: Layout.screenPaddingH, paddingBottom: hScale(40) },
  subtitle: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginBottom: hScale(20), lineHeight: hScale(21) },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: wScale(12) },
  chip: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: wScale(16),
    borderWidth: 1.5,
    borderColor: colors.stroke,
    padding: wScale(16),
    alignItems: 'center',
    gap: hScale(8),
    position: 'relative',
  },
  chipSelected: { backgroundColor: colors.white },
  chipIcon: { width: wScale(48), height: wScale(48), borderRadius: wScale(14), alignItems: 'center', justifyContent: 'center' },
  chipLabel: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, textAlign: 'center' },
  checkBadge: {
    position: 'absolute', top: wScale(8), right: wScale(8),
    width: wScale(18), height: wScale(18), borderRadius: wScale(9),
    alignItems: 'center', justifyContent: 'center',
  },
  selectedCount: {
    marginTop: hScale(20), textAlign: 'center',
    fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary,
  },
});
