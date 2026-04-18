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

interface NotifSetting { id: string; icon: string; iconBg: string; iconColor: string; label: string; description: string; enabled: boolean }

const SETTINGS: NotifSetting[] = [
  { id: 'push', icon: 'solar:bell-bold', iconBg: '#EBF3FE', iconColor: '#3182ED', label: 'Push Notifications', description: 'Receive push notifications on your device', enabled: true },
  { id: 'route', icon: 'solar:route-bold', iconBg: '#D1FAE5', iconColor: '#10B981', label: 'Route Reminders', description: 'Get reminded about upcoming route stops', enabled: true },
  { id: 'suggest', icon: 'solar:star-bold', iconBg: '#FEF3C7', iconColor: '#F59E0B', label: 'New Suggestions', description: 'Nearby gems and trending places', enabled: false },
  { id: 'promo', icon: 'solar:tag-bold', iconBg: '#FFE4E6', iconColor: '#EF4444', label: 'Promotions', description: 'Special offers and premium features', enabled: false },
];

const NotificationSettingsScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [settings, setSettings] = useState(SETTINGS);

  const toggle = (id: string) =>
    setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: wScale(36) }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {settings.map((s, i) => (
            <View key={s.id} style={[styles.row, i < settings.length - 1 && styles.rowBorder]}>
              <View style={[styles.iconBox, { backgroundColor: s.iconBg }]}>
                <Iconify icon={s.icon} size={wScale(17)} color={s.iconColor} />
              </View>
              <View style={styles.info}>
                <Text style={styles.label}>{s.label}</Text>
                <Text style={styles.desc}>{s.description}</Text>
              </View>
              <Switch
                value={s.enabled}
                onValueChange={() => toggle(s.id)}
                trackColor={{ false: colors.stroke, true: colors.primaryLight }}
                thumbColor={s.enabled ? colors.primary : colors.textSecondary}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationSettingsScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  scroll: { padding: Layout.screenPaddingH, paddingBottom: hScale(40) },
  card: {
    backgroundColor: colors.white, borderRadius: wScale(18), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(16),
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: hScale(14), gap: wScale(12) },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.stroke },
  iconBox: { width: wScale(38), height: wScale(38), borderRadius: wScale(11), alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  label: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textPrimary, marginBottom: hScale(2) },
  desc: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
