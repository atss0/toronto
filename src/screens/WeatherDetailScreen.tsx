import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types/navigation';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

type RouteT = RouteProp<RootStackParamList, 'WeatherDetail'>;

const HOURLY = [
  { time: 'Now', icon: 'solar:sun-bold', temp: 21 },
  { time: '14:00', icon: 'solar:sun-bold', temp: 23 },
  { time: '15:00', icon: 'solar:cloudy-moon-bold', temp: 22 },
  { time: '16:00', icon: 'solar:cloudy-moon-bold', temp: 20 },
  { time: '17:00', icon: 'solar:cloud-rain-bold', temp: 18 },
  { time: '18:00', icon: 'solar:cloud-rain-bold', temp: 17 },
];

const WEEKLY = [
  { day: 'Today', icon: 'solar:sun-bold', high: 23, low: 14 },
  { day: 'Fri', icon: 'solar:sun-bold', high: 25, low: 15 },
  { day: 'Sat', icon: 'solar:cloudy-moon-bold', high: 20, low: 12 },
  { day: 'Sun', icon: 'solar:cloud-rain-bold', high: 16, low: 11 },
  { day: 'Mon', icon: 'solar:sun-bold', high: 22, low: 13 },
  { day: 'Tue', icon: 'solar:sun-bold', high: 24, low: 14 },
  { day: 'Wed', icon: 'solar:cloudy-moon-bold', high: 21, low: 13 },
];

const WeatherDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { city } = route.params;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.hero}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('common.goBack')}
          accessibilityRole="button"
        >
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.cityName}>{city}</Text>
        <Iconify icon="solar:sun-bold" size={wScale(64)} color="#FFFFFF" />
        <Text style={styles.tempLarge}>21°C</Text>
        <Text style={styles.condition}>{t('weather.condition')}</Text>
        <Text style={styles.hiLow}>H: 23°  L: 14°</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('weather.hourlyForecast')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyList}>
            {HOURLY.map((h, i) => (
              <View key={i} style={[styles.hourCard, i === 0 && styles.hourCardActive]}>
                <Text style={[styles.hourTime, i === 0 && styles.hourTimeActive]}>{h.time}</Text>
                <Iconify icon={h.icon} size={wScale(20)} color={i === 0 ? '#FFF' : colors.warning} />
                <Text style={[styles.hourTemp, i === 0 && styles.hourTempActive]}>{h.temp}°</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('weather.weeklyForecast')}</Text>
          {WEEKLY.map((day, i) => (
            <View key={i} style={styles.dayRow}>
              <Text style={styles.dayName}>{day.day}</Text>
              <Iconify icon={day.icon} size={wScale(18)} color={colors.warning} />
              <View style={{ flex: 1 }} />
              <Text style={styles.dayHigh}>{day.high}°</Text>
              <Text style={styles.dayLow}>{day.low}°</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailsGrid}>
          {[
            { icon: 'solar:wind-bold', label: t('weather.wind'), value: '12 km/h' },
            { icon: 'solar:waterdrop-bold', label: t('weather.humidity'), value: '58%' },
            { icon: 'solar:eye-bold', label: t('weather.visibility'), value: '10 km' },
            { icon: 'solar:sun-2-bold', label: t('weather.uvIndex'), value: '5 (Mod)' },
          ].map(d => (
            <View key={d.label} style={styles.detailCard}>
              <Iconify icon={d.icon} size={wScale(20)} color={colors.primary} />
              <Text style={styles.detailValue}>{d.value}</Text>
              <Text style={styles.detailLabel}>{d.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default WeatherDetailScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primary, alignItems: 'center', paddingBottom: hScale(28),
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), gap: hScale(4),
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: Layout.hitArea.backButton, height: Layout.hitArea.backButton,
    alignItems: 'center', justifyContent: 'center', marginBottom: hScale(8),
  },
  cityName: { fontSize: wScale(18), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF', opacity: 0.9, marginBottom: hScale(8) },
  tempLarge: { fontSize: wScale(64), fontFamily: Fonts.plusJakartaSansExtraBold, color: '#FFFFFF', lineHeight: hScale(76) },
  condition: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansRegular, color: 'rgba(255,255,255,0.85)' },
  hiLow: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansMedium, color: 'rgba(255,255,255,0.75)' },
  content: { paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(20), paddingBottom: hScale(40) },
  section: { marginBottom: hScale(24) },
  sectionTitle: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, marginBottom: hScale(12) },
  hourlyList: { gap: wScale(10) },
  hourCard: {
    alignItems: 'center', gap: hScale(6),
    paddingHorizontal: wScale(14), paddingVertical: hScale(12),
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: colors.stroke,
  },
  hourCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  hourTime: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary },
  hourTimeActive: { color: 'rgba(255,255,255,0.85)' },
  hourTemp: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  hourTempActive: { color: '#FFFFFF' },
  dayRow: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(12),
    paddingVertical: hScale(10), borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  dayName: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textPrimary, width: wScale(44) },
  dayHigh: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, width: wScale(32), textAlign: 'right' },
  dayLow: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, width: wScale(32), textAlign: 'right' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: wScale(10) },
  detailCard: {
    width: '47.5%', alignItems: 'center', gap: hScale(4),
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.lg, borderWidth: 1, borderColor: colors.stroke, padding: wScale(16),
  },
  detailValue: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  detailLabel: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
