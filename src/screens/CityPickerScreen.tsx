import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector, useDispatch } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';
import { setLocationName } from '../redux/UserSlice';

const CITIES = [
  { id: '1', name: 'Istanbul', country: 'Turkey', icon: 'solar:city-bold', popular: true },
  { id: '2', name: 'Ankara', country: 'Turkey', icon: 'solar:city-bold', popular: true },
  { id: '3', name: 'Izmir', country: 'Turkey', icon: 'solar:city-bold', popular: false },
  { id: '4', name: 'Antalya', country: 'Turkey', icon: 'solar:city-bold', popular: true },
  { id: '5', name: 'Bursa', country: 'Turkey', icon: 'solar:city-bold', popular: false },
  { id: '6', name: 'Cappadocia', country: 'Turkey', icon: 'solar:city-bold', popular: true },
  { id: '7', name: 'Trabzon', country: 'Turkey', icon: 'solar:city-bold', popular: false },
  { id: '8', name: 'Konya', country: 'Turkey', icon: 'solar:city-bold', popular: false },
];

const CityPickerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const storedCity = useSelector((s: RootState) => s.User.locationName) || 'Istanbul';
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(storedCity);

  const filtered = query.trim()
    ? CITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : CITIES;

  const popular = filtered.filter(c => c.popular);
  const others = filtered.filter(c => !c.popular);

  const selectCity = (name: string) => {
    setSelectedCity(name);
    dispatch(setLocationName(name));
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select City</Text>
        <View style={{ width: wScale(36) }} />
      </View>

      <View style={styles.searchWrap}>
        <Iconify icon="solar:magnifer-linear" size={wScale(15)} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search cities..."
          placeholderTextColor={colors.textSecondary}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
            <Iconify icon="solar:close-circle-bold" size={wScale(15)} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          popular.length > 0 && !query ? (
            <Text style={styles.sectionTitle}>Popular Cities</Text>
          ) : null
        }
        renderItem={({ item, index }) => {
          const isFirstOther = !item.popular && query === '' && index === popular.length;
          return (
            <>
              {isFirstOther && <Text style={[styles.sectionTitle, { marginTop: hScale(8) }]}>All Cities</Text>}
              <TouchableOpacity
                style={[styles.cityRow, item.name === selectedCity && styles.cityRowActive]}
                onPress={() => selectCity(item.name)}
                activeOpacity={0.8}
              >
                <View style={[styles.cityIcon, item.name === selectedCity && styles.cityIconActive]}>
                  <Iconify icon={item.icon} size={wScale(18)} color={item.name === selectedCity ? '#FFF' : colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cityName, item.name === selectedCity && styles.cityNameActive]}>{item.name}</Text>
                  <Text style={styles.countryName}>{item.country}</Text>
                </View>
                {item.name === selectedCity && (
                  <Iconify icon="solar:check-circle-bold" size={wScale(20)} color={colors.primary} />
                )}
              </TouchableOpacity>
            </>
          );
        }}
      />
    </View>
  );
};

export default CityPickerScreen;

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
    flexDirection: 'row', alignItems: 'center', gap: wScale(8),
    marginHorizontal: Layout.screenPaddingH, marginVertical: hScale(12),
    backgroundColor: colors.white, borderRadius: wScale(14), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(12),
  },
  searchInput: { flex: 1, fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary, padding: 0 },
  list: { paddingHorizontal: Layout.screenPaddingH, paddingBottom: hScale(40), gap: hScale(8) },
  sectionTitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary, marginBottom: hScale(4) },
  cityRow: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(12),
    backgroundColor: colors.white, borderRadius: wScale(14), borderWidth: 1, borderColor: colors.stroke, padding: wScale(12),
  },
  cityRowActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  cityIcon: {
    width: wScale(40), height: wScale(40), borderRadius: wScale(12),
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  cityIconActive: { backgroundColor: colors.primary },
  cityName: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary },
  cityNameActive: { color: colors.primary },
  countryName: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
