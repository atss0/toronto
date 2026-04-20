import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
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

const CITIES = [
  { id: '1',  name: 'Paris',        country: 'France',       icon: 'solar:city-bold', popular: true },
  { id: '2',  name: 'London',       country: 'United Kingdom', icon: 'solar:city-bold', popular: true },
  { id: '3',  name: 'New York',     country: 'United States', icon: 'solar:city-bold', popular: true },
  { id: '4',  name: 'Tokyo',        country: 'Japan',         icon: 'solar:city-bold', popular: true },
  { id: '5',  name: 'Rome',         country: 'Italy',         icon: 'solar:city-bold', popular: true },
  { id: '6',  name: 'Istanbul',     country: 'Turkey',        icon: 'solar:city-bold', popular: true },
  { id: '7',  name: 'Barcelona',    country: 'Spain',         icon: 'solar:city-bold', popular: true },
  { id: '8',  name: 'Amsterdam',    country: 'Netherlands',   icon: 'solar:city-bold', popular: true },
  { id: '9',  name: 'Dubai',        country: 'UAE',           icon: 'solar:city-bold', popular: true },
  { id: '10', name: 'Singapore',    country: 'Singapore',     icon: 'solar:city-bold', popular: true },
  { id: '11', name: 'Bangkok',      country: 'Thailand',      icon: 'solar:city-bold', popular: false },
  { id: '12', name: 'Sydney',       country: 'Australia',     icon: 'solar:city-bold', popular: false },
  { id: '13', name: 'Berlin',       country: 'Germany',       icon: 'solar:city-bold', popular: false },
  { id: '14', name: 'Prague',       country: 'Czech Republic', icon: 'solar:city-bold', popular: false },
  { id: '15', name: 'Vienna',       country: 'Austria',       icon: 'solar:city-bold', popular: false },
  { id: '16', name: 'Lisbon',       country: 'Portugal',      icon: 'solar:city-bold', popular: false },
  { id: '17', name: 'Madrid',       country: 'Spain',         icon: 'solar:city-bold', popular: false },
  { id: '18', name: 'Milan',        country: 'Italy',         icon: 'solar:city-bold', popular: false },
  { id: '19', name: 'Athens',       country: 'Greece',        icon: 'solar:city-bold', popular: false },
  { id: '20', name: 'Seoul',        country: 'South Korea',   icon: 'solar:city-bold', popular: false },
  { id: '21', name: 'Hong Kong',    country: 'China',         icon: 'solar:city-bold', popular: false },
  { id: '22', name: 'Bali',         country: 'Indonesia',     icon: 'solar:city-bold', popular: false },
  { id: '23', name: 'Mexico City',  country: 'Mexico',        icon: 'solar:city-bold', popular: false },
  { id: '24', name: 'Buenos Aires', country: 'Argentina',     icon: 'solar:city-bold', popular: false },
  { id: '25', name: 'Cape Town',    country: 'South Africa',  icon: 'solar:city-bold', popular: false },
  { id: '26', name: 'Marrakech',    country: 'Morocco',       icon: 'solar:city-bold', popular: false },
  { id: '27', name: 'Antalya',      country: 'Turkey',        icon: 'solar:city-bold', popular: false },
  { id: '28', name: 'Kyoto',        country: 'Japan',         icon: 'solar:city-bold', popular: false },
  { id: '29', name: 'Vancouver',    country: 'Canada',        icon: 'solar:city-bold', popular: false },
  { id: '30', name: 'San Francisco', country: 'United States', icon: 'solar:city-bold', popular: false },
];

const CityPickerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [query, setQuery] = useState('');
  const currentCity = useSelector((s: RootState) => s.User.locationName) || 'Istanbul';

  const filtered = query.trim()
    ? CITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : CITIES;

  const popular = filtered.filter(c => c.popular);

  const selectCity = (name: string) => {
    dispatch(setLocationName(name));
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StackHeader title={t('cityPicker.title')} />

      <View style={styles.searchWrap}>
        <Iconify icon="solar:magnifer-linear" size={wScale(15)} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder={t('cityPicker.searchPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          autoFocus
          accessibilityLabel={t('cityPicker.searchPlaceholder')}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
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
            <Text style={styles.sectionTitle}>{t('cityPicker.popularCities')}</Text>
          ) : null
        }
        renderItem={({ item, index }) => {
          const isFirstOther = !item.popular && query === '' && index === popular.length;
          const isSelected = item.name === currentCity;
          return (
            <>
              {isFirstOther && <Text style={[styles.sectionTitle, { marginTop: hScale(8) }]}>{t('cityPicker.allCities')}</Text>}
              <TouchableOpacity
                style={[styles.cityRow, isSelected && styles.cityRowActive]}
                onPress={() => selectCity(item.name)}
                activeOpacity={0.8}
                accessibilityLabel={`${item.name}, ${item.country}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={[styles.cityIcon, isSelected && styles.cityIconActive]}>
                  <Iconify icon={item.icon} size={wScale(18)} color={isSelected ? '#FFF' : colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cityName, isSelected && styles.cityNameActive]}>{item.name}</Text>
                  <Text style={styles.countryName}>{item.country}</Text>
                </View>
                {isSelected && (
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
});
