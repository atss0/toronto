import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

const CITIES = ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa', 'London', 'Paris', 'New York'];

const LocationSettingsScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Istanbul');

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Location Access</Text>
        <View style={{ width: wScale(36) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Status */}
        <View style={styles.statusCard}>
          <View style={[styles.statusIcon, { backgroundColor: locationEnabled ? colors.successLight : colors.dangerLight }]}>
            <Iconify
              icon="solar:map-point-bold"
              size={wScale(24)}
              color={locationEnabled ? colors.success : colors.danger}
            />
          </View>
          <Text style={styles.statusTitle}>Location Services</Text>
          <Text style={styles.statusDesc}>
            {locationEnabled
              ? 'Location access is enabled. We can show you nearby places.'
              : 'Location access is disabled. Enable it to see nearby recommendations.'}
          </Text>
        </View>

        {/* Toggles */}
        <View style={styles.card}>
          {[
            { label: 'Enable Location', desc: 'Allow the app to access your location', value: locationEnabled, setter: setLocationEnabled },
            { label: 'Background Location', desc: 'Track location even when app is in background', value: backgroundEnabled, setter: setBackgroundEnabled },
          ].map((item, i, arr) => (
            <View key={item.label} style={[styles.row, i < arr.length - 1 && styles.rowBorder]}>
              <View style={styles.info}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.setter}
                trackColor={{ false: colors.stroke, true: colors.primaryLight }}
                thumbColor={item.value ? colors.primary : colors.textSecondary}
              />
            </View>
          ))}
        </View>

        {/* Default City */}
        <Text style={styles.sectionLabel}>DEFAULT CITY</Text>
        <View style={styles.card}>
          {CITIES.map((city, i) => (
            <TouchableOpacity
              key={city}
              style={[styles.cityRow, i < CITIES.length - 1 && styles.rowBorder]}
              onPress={() => setSelectedCity(city)}
              activeOpacity={0.7}
            >
              <Text style={[styles.cityLabel, city === selectedCity && styles.cityLabelActive]}>{city}</Text>
              {city === selectedCity && (
                <Iconify icon="solar:check-circle-bold" size={wScale(18)} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default LocationSettingsScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  scroll: { padding: Layout.screenPaddingH, paddingBottom: hScale(40), gap: hScale(16) },
  statusCard: {
    backgroundColor: colors.white, borderRadius: wScale(18), borderWidth: 1, borderColor: colors.stroke,
    padding: wScale(20), alignItems: 'center', gap: hScale(8),
  },
  statusIcon: { width: wScale(56), height: wScale(56), borderRadius: wScale(28), alignItems: 'center', justifyContent: 'center', marginBottom: hScale(4) },
  statusTitle: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  statusDesc: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, textAlign: 'center', lineHeight: hScale(19) },
  sectionLabel: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansBold, color: colors.textSecondary, letterSpacing: 1, marginBottom: hScale(-8) },
  card: { backgroundColor: colors.white, borderRadius: wScale(18), borderWidth: 1, borderColor: colors.stroke, paddingHorizontal: wScale(16) },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: hScale(14), gap: wScale(12) },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.stroke },
  info: { flex: 1 },
  label: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textPrimary, marginBottom: hScale(2) },
  desc: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  cityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: hScale(14) },
  cityLabel: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textPrimary },
  cityLabelActive: { color: colors.primary, fontFamily: Fonts.plusJakartaSansBold },
});
