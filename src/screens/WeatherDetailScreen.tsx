import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView,
  ActivityIndicator, RefreshControl,
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
import weatherService, { WeatherData } from '../services/weather';

type RouteT = RouteProp<RootStackParamList, 'WeatherDetail'>;

const ICON_MAP: Record<string, string> = {
  sunny: 'ph:sun-duotone',
  partly_cloudy: 'ph:cloud-sun-duotone',
  rain: 'ph:cloud-rain-duotone',
  thunderstorm: 'ph:cloud-lightning-duotone',
  snow: 'ph:cloud-snow-duotone',
  fog: 'ph:cloud-fog-duotone',
};

const getWeatherIcon = (icon: string) => ICON_MAP[icon] ?? 'ph:sun-duotone';

const WeatherDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { city } = route.params;

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const fetchWeather = useCallback(async () => {
    try {
      setError(false);
      const res = await weatherService.get({ city });
      setWeather(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather();
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.centered]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={[styles.root, styles.centered]}>
        <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} />
        <TouchableOpacity style={styles.backBtnAbsolute} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Iconify icon="solar:cloud-cross-bold" size={wScale(48)} color={colors.textSecondary} />
        <Text style={styles.errorTitle}>{t('weather.unavailable', 'Weather unavailable')}</Text>
        <TouchableOpacity onPress={fetchWeather} style={styles.retryBtn}>
          <Text style={styles.retryText}>{t('common.retry', 'Retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { current, hourly, weekly } = weather;
  const hiLowRow = weekly.length > 0 ? `H: ${weekly[0].high}°  L: ${weekly[0].low}°` : '';

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
        <Text style={styles.cityName}>{weather.city}</Text>
        <Iconify icon={getWeatherIcon(current.icon)} size={wScale(64)} color="#FFFFFF" />
        <Text style={styles.tempLarge}>{current.temp_c}°C</Text>
        <Text style={styles.condition}>{current.condition}</Text>
        {hiLowRow ? <Text style={styles.hiLow}>{hiLowRow}</Text> : null}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {hourly.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('weather.hourlyForecast')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyList}>
              {hourly.map((h, i) => (
                <View key={i} style={[styles.hourCard, i === 0 && styles.hourCardActive]}>
                  <Text style={[styles.hourTime, i === 0 && styles.hourTimeActive]}>{h.time}</Text>
                  <Iconify icon={getWeatherIcon(h.icon)} size={wScale(20)} color={i === 0 ? '#FFF' : colors.warning} />
                  <Text style={[styles.hourTemp, i === 0 && styles.hourTempActive]}>{h.temp_c}°</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {weekly.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('weather.weeklyForecast')}</Text>
            {weekly.map((day, i) => (
              <View key={i} style={styles.dayRow}>
                <Text style={styles.dayName}>{day.day}</Text>
                <Iconify icon={getWeatherIcon(day.icon)} size={wScale(18)} color={colors.warning} />
                <View style={{ flex: 1 }} />
                <Text style={styles.dayHigh}>{day.high}°</Text>
                <Text style={styles.dayLow}>{day.low}°</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.detailsGrid}>
          {[
            { icon: 'solar:wind-bold', label: t('weather.wind'), value: `${current.wind_kmh} km/h` },
            { icon: 'solar:waterdrop-bold', label: t('weather.humidity'), value: `${current.humidity_percent}%` },
            { icon: 'solar:eye-bold', label: t('weather.visibility'), value: `${current.visibility_km} km` },
            {
              icon: 'solar:sun-2-bold',
              label: t('weather.uvIndex'),
              value: current.uv_index != null ? String(current.uv_index) : '-',
            },
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
  centered: { alignItems: 'center', justifyContent: 'center' },
  backBtnAbsolute: {
    position: 'absolute', top: hScale(16), left: Layout.screenPaddingH,
    width: Layout.hitArea.backButton, height: Layout.hitArea.backButton,
    alignItems: 'center', justifyContent: 'center',
  },
  errorTitle: {
    fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary,
    marginTop: hScale(12),
  },
  retryBtn: {
    marginTop: hScale(16), paddingHorizontal: wScale(24), paddingVertical: hScale(10),
    backgroundColor: colors.primary, borderRadius: Layout.borderRadius.md,
  },
  retryText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: '#FFFFFF' },
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
  hiLow: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansMedium, color: 'rgba(255,255,255,0.9)' },
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
