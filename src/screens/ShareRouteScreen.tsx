import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Share, Alert, Clipboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { RootStackParamList } from '../types/navigation';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

type RouteT = RouteProp<RootStackParamList, 'ShareRoute'>;

const SHARE_OPTIONS = [
  { icon: 'solar:copy-bold', label: 'Copy Link', color: '#6366F1' },
  { icon: 'solar:share-bold', label: 'Share via...', color: '#10B981' },
  { icon: 'solar:qr-code-bold', label: 'Show QR Code', color: '#F59E0B' },
];

const ShareRouteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { routeName } = route.params;

  const LINK = 'toronto-app.com/routes/share/abc123';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${routeName}" on Toronto Travel App! ${LINK}`,
        title: routeName,
      });
    } catch {}
  };

  const handleCopyLink = () => {
    Clipboard.setString(LINK);
    Alert.alert('Copied!', 'Link copied to clipboard.');
  };

  const handleQRCode = () => {
    Alert.alert('QR Code', 'QR code feature coming soon.', [{ text: 'OK' }]);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Route</Text>
        <View style={{ width: wScale(36) }} />
      </View>

      <View style={styles.content}>
        <View style={styles.routeCard}>
          <View style={styles.routeIcon}>
            <Iconify icon="solar:routing-bold" size={wScale(28)} color={colors.primary} />
          </View>
          <Text style={styles.routeName}>{routeName}</Text>
          <Text style={styles.routeSubtitle}>Share this route with friends</Text>
        </View>

        <View style={styles.linkCard}>
          <Text style={styles.linkText} numberOfLines={1}>{LINK}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopyLink} hitSlop={8}>
            <Iconify icon="solar:copy-linear" size={wScale(14)} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsGrid}>
          {SHARE_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.label}
              style={styles.optionBtn}
              onPress={opt.label === 'Share via...' ? handleShare : opt.label === 'Copy Link' ? handleCopyLink : handleQRCode}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIcon, { backgroundColor: `${opt.color}18` }]}>
                <Iconify icon={opt.icon} size={wScale(22)} color={opt.color} />
              </View>
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Share to</Text>
        <View style={styles.appsRow}>
          {[
            { icon: 'mdi:whatsapp', label: 'WhatsApp', color: '#25D366' },
            { icon: 'mdi:twitter', label: 'Twitter', color: '#1DA1F2' },
            { icon: 'mdi:instagram', label: 'Instagram', color: '#E1306C' },
            { icon: 'mdi:email', label: 'Email', color: '#EA4335' },
          ].map(app => (
            <TouchableOpacity key={app.label} style={styles.appBtn} onPress={handleShare} activeOpacity={0.8}>
              <View style={[styles.appIcon, { backgroundColor: `${app.color}15` }]}>
                <Iconify icon={app.icon} size={wScale(24)} color={app.color} />
              </View>
              <Text style={styles.appLabel}>{app.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ShareRouteScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  content: { padding: Layout.screenPaddingH },
  routeCard: {
    alignItems: 'center', padding: wScale(24),
    backgroundColor: colors.white, borderRadius: wScale(20), borderWidth: 1, borderColor: colors.stroke,
    marginBottom: hScale(14), gap: hScale(6),
  },
  routeIcon: {
    width: wScale(64), height: wScale(64), borderRadius: wScale(20),
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: hScale(4),
  },
  routeName: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, textAlign: 'center' },
  routeSubtitle: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  linkCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.inputBackground, borderRadius: wScale(14), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(12), marginBottom: hScale(18),
  },
  linkText: { flex: 1, fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  copyBtn: { marginLeft: wScale(8) },
  optionsGrid: { flexDirection: 'row', gap: wScale(10), marginBottom: hScale(18) },
  optionBtn: { flex: 1, alignItems: 'center', gap: hScale(6) },
  optionIcon: { width: wScale(52), height: wScale(52), borderRadius: wScale(16), alignItems: 'center', justifyContent: 'center' },
  optionLabel: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textPrimary, textAlign: 'center' },
  divider: { height: 1, backgroundColor: colors.stroke, marginBottom: hScale(16) },
  sectionTitle: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(14) },
  appsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  appBtn: { alignItems: 'center', gap: hScale(6) },
  appIcon: { width: wScale(52), height: wScale(52), borderRadius: wScale(16), alignItems: 'center', justifyContent: 'center' },
  appLabel: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
