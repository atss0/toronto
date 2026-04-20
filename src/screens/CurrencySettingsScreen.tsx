import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
];

const CurrencySettingsScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [selected, setSelected] = useState('USD');
  const [search, setSearch] = useState('');

  const filtered = CURRENCIES.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Currency</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Coming Soon Banner */}
      <View style={styles.comingSoonBanner}>
        <Iconify icon="solar:clock-circle-bold" size={wScale(18)} color="#B45309" />
        <View style={{ flex: 1 }}>
          <Text style={styles.comingSoonTitle}>{t('currency.comingSoonTitle')}</Text>
          <Text style={styles.comingSoonDesc}>{t('currency.comingSoonDesc')}</Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <Iconify icon="solar:magnifer-linear" size={wScale(16)} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search currency..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {filtered.map((c, i) => (
            <TouchableOpacity
              key={c.code}
              style={[styles.row, i < filtered.length - 1 && styles.rowBorder]}
              onPress={() => setSelected(c.code)}
              activeOpacity={0.7}
            >
              <View style={styles.symbolBox}>
                <Text style={styles.symbol}>{c.symbol}</Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.code, c.code === selected && { color: colors.primary }]}>{c.code}</Text>
                <Text style={styles.name}>{c.name}</Text>
              </View>
              {c.code === selected && <Iconify icon="solar:check-circle-bold" size={wScale(20)} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CurrencySettingsScreen;

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
  comingSoonBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wScale(10),
    margin: Layout.screenPaddingH,
    marginBottom: 0,
    backgroundColor: '#FEF3C7',
    borderRadius: wScale(12),
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: wScale(14),
    paddingVertical: hScale(12),
  },
  comingSoonTitle: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansBold,
    color: '#92400E',
    marginBottom: hScale(2),
  },
  comingSoonDesc: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: '#B45309',
    lineHeight: hScale(16),
  },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(10),
    margin: Layout.screenPaddingH, backgroundColor: colors.white,
    borderRadius: wScale(12), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(10),
  },
  searchInput: { flex: 1, fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary, padding: 0 },
  scroll: { paddingHorizontal: Layout.screenPaddingH, paddingBottom: hScale(40) },
  card: { backgroundColor: colors.white, borderRadius: wScale(18), borderWidth: 1, borderColor: colors.stroke, paddingHorizontal: wScale(16) },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: hScale(13), gap: wScale(12) },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.stroke },
  symbolBox: {
    width: wScale(40), height: wScale(40), borderRadius: wScale(12),
    backgroundColor: colors.inputBackground, alignItems: 'center', justifyContent: 'center',
  },
  symbol: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  info: { flex: 1 },
  code: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, marginBottom: hScale(2) },
  name: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
