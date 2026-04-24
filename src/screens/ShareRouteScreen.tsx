import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Share, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import Clipboard from '@react-native-clipboard/clipboard';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types/navigation';
import StackHeader from '../components/StackHeader/StackHeader';
import { useColors } from '../context/ThemeContext';
import routesService from '../services/routes';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';

type RouteT = RouteProp<RootStackParamList, 'ShareRoute'>;

const ShareRouteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { routeId, routeName } = route.params;
  const [shareUrl, setShareUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);

  useEffect(() => {
    if (!routeId) { setIsLoadingUrl(false); return; }
    routesService.share(routeId)
      .then(res => setShareUrl(res.data.data.share_url ?? ''))
      .catch(() => {})
      .finally(() => setIsLoadingUrl(false));
  }, [routeId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${routeName}" on Toronto Travel App!${shareUrl ? ` ${shareUrl}` : ''}`,
        title: routeName,
      });
    } catch {}
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    try {
      Clipboard.setString(shareUrl);
    } catch {
      // Clipboard may not be available
    }
    Alert.alert('✓', t('share.linkCopied'));
  };

  const handleShowQR = () => {
    Alert.alert('QR Code', t('share.qrComingSoon'));
  };

  const SHARE_OPTIONS = [
    { icon: 'solar:copy-bold', label: t('share.copyLink'), color: '#6366F1', action: handleCopyLink },
    { icon: 'solar:share-bold', label: t('share.shareVia'), color: '#10B981', action: handleShare },
    { icon: 'solar:qr-code-bold', label: t('share.showQR'), color: '#F59E0B', action: handleShowQR },
  ];

  return (
    <View style={styles.root}>
      <StackHeader title={t('share.title')} />

      <View style={styles.content}>
        <View style={styles.routeCard}>
          <View style={styles.routeIcon}>
            <Iconify icon="solar:routing-bold" size={wScale(28)} color={colors.primary} />
          </View>
          <Text style={styles.routeName}>{routeName}</Text>
          <Text style={styles.routeSubtitle}>{t('share.shareWith')}</Text>
        </View>

        <View style={styles.linkCard}>
          {isLoadingUrl
            ? <ActivityIndicator color={colors.primary} size="small" style={{ flex: 1 }} />
            : <Text style={styles.linkText} numberOfLines={1}>{shareUrl || '—'}</Text>}
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={handleCopyLink}
            disabled={!shareUrl}
            accessibilityLabel={t('share.copyLink')}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Iconify icon="solar:copy-linear" size={wScale(14)} color={shareUrl ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsGrid}>
          {SHARE_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.label}
              style={styles.optionBtn}
              onPress={opt.action}
              activeOpacity={0.8}
              accessibilityLabel={opt.label}
              accessibilityRole="button"
            >
              <View style={[styles.optionIcon, { backgroundColor: `${opt.color}18` }]}>
                <Iconify icon={opt.icon} size={wScale(22)} color={opt.color} />
              </View>
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>{t('share.shareTo')}</Text>
        <View style={styles.appsRow}>
          {[
            { icon: 'mdi:whatsapp', label: 'WhatsApp', color: '#25D366' },
            { icon: 'mdi:twitter', label: 'Twitter', color: '#1DA1F2' },
            { icon: 'mdi:instagram', label: 'Instagram', color: '#E1306C' },
            { icon: 'mdi:email', label: 'Email', color: '#EA4335' },
          ].map(app => (
            <TouchableOpacity
              key={app.label}
              style={styles.appBtn}
              onPress={handleShare}
              activeOpacity={0.8}
              accessibilityLabel={`Share to ${app.label}`}
              accessibilityRole="button"
            >
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
  content: { padding: Layout.screenPaddingH },
  routeCard: {
    alignItems: 'center', padding: wScale(24),
    backgroundColor: colors.white, borderRadius: Layout.borderRadius['2xl'], borderWidth: 1, borderColor: colors.stroke,
    marginBottom: hScale(14), gap: hScale(6),
  },
  routeIcon: {
    width: wScale(64), height: wScale(64), borderRadius: Layout.borderRadius['2xl'],
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: hScale(4),
  },
  routeName: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, textAlign: 'center' },
  routeSubtitle: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  linkCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.inputBackground, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(12), marginBottom: hScale(18),
  },
  linkText: { flex: 1, fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  copyBtn: { marginLeft: wScale(8) },
  optionsGrid: { flexDirection: 'row', gap: wScale(10), marginBottom: hScale(18) },
  optionBtn: { flex: 1, alignItems: 'center', gap: hScale(6) },
  optionIcon: { width: wScale(52), height: wScale(52), borderRadius: Layout.borderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  optionLabel: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textPrimary, textAlign: 'center' },
  divider: { height: 1, backgroundColor: colors.stroke, marginBottom: hScale(16) },
  sectionTitle: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(14) },
  appsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  appBtn: { alignItems: 'center', gap: hScale(6) },
  appIcon: { width: wScale(52), height: wScale(52), borderRadius: Layout.borderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  appLabel: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
