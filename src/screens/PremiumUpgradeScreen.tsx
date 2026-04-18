import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
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

const FEATURE_ICONS = [
  'solar:map-arrow-right-bold',
  'solar:cloud-download-bold',
  'solar:star-bold',
  'solar:bell-bold',
  'solar:shield-bold',
];

const PLAN_IDS = ['monthly', 'annual'] as const;

const PremiumUpgradeScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const { t } = useTranslation();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [selectedPlan, setSelectedPlan] = React.useState('annual');

  const FEATURES = useMemo(() => FEATURE_ICONS.map((icon, i) => ({
    icon,
    label: t(`premium.feature${i + 1}Label`),
    desc: t(`premium.feature${i + 1}Desc`),
  })), [t]);

  const PLANS = useMemo(() => [
    { id: 'monthly', label: t('premium.monthly'), price: t('premium.monthlyPrice'), sub: t('premium.monthlyPer'), popular: false },
    { id: 'annual', label: t('premium.annual'), price: t('premium.annualPrice'), sub: t('premium.annualPer'), popular: true },
  ], [t]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.heroHeader}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:close-circle-linear" size={wScale(22)} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.crownWrap}>
          <Iconify icon="solar:crown-bold" size={wScale(40)} color={colors.warning} />
        </View>
        <Text style={styles.heroTitle}>{t('premium.title')}</Text>
        <Text style={styles.heroSubtitle}>{t('premium.subtitle')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Features */}
        <View style={styles.section}>
          {FEATURES.map(f => (
            <View key={f.label} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Iconify icon={f.icon} size={wScale(18)} color={colors.primary} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plansRow}>
          {PLANS.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, plan.id === selectedPlan && styles.planCardActive]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.8}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>{t('premium.popular')}</Text>
                </View>
              )}
              <Text style={[styles.planLabel, plan.id === selectedPlan && { color: colors.primary }]}>{plan.label}</Text>
              <Text style={[styles.planPrice, plan.id === selectedPlan && { color: colors.primary }]}>{plan.price}</Text>
              <Text style={styles.planSub}>{plan.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.cta} activeOpacity={0.85}>
          <Iconify icon="solar:crown-bold" size={wScale(18)} color={colors.warning} />
          <Text style={styles.ctaText}>{t('premium.startTrial')}</Text>
        </TouchableOpacity>
        <Text style={styles.ctaNote}>{t('premium.trialNote')}</Text>

        <Text style={styles.legal}>{t('premium.legalNote')}</Text>
      </ScrollView>
    </View>
  );
};

export default PremiumUpgradeScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  heroHeader: {
    backgroundColor: colors.primary,
    paddingTop: hScale(48),
    paddingBottom: hScale(32),
    alignItems: 'center',
    gap: hScale(8),
  },
  closeBtn: { position: 'absolute', top: hScale(16), left: wScale(16), width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  crownWrap: { width: wScale(70), height: wScale(70), borderRadius: wScale(22), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: hScale(8) },
  heroTitle: { fontSize: wScale(24), fontFamily: Fonts.plusJakartaSansExtraBold, color: '#FFFFFF', letterSpacing: -0.3 },
  heroSubtitle: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: 'rgba(255,255,255,0.8)' },
  scroll: { padding: Layout.screenPaddingH, paddingBottom: hScale(40) },
  section: { gap: hScale(16), marginVertical: hScale(24) },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wScale(14) },
  featureIcon: { width: wScale(42), height: wScale(42), borderRadius: wScale(12), backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureInfo: { flex: 1 },
  featureLabel: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, marginBottom: hScale(3) },
  featureDesc: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, lineHeight: hScale(18) },
  plansRow: { flexDirection: 'row', gap: wScale(12), marginBottom: hScale(24) },
  planCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: wScale(16), borderWidth: 1.5, borderColor: colors.stroke,
    padding: wScale(16), alignItems: 'center', gap: hScale(4),
  },
  planCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight + '44' },
  popularBadge: { backgroundColor: colors.primary, paddingHorizontal: wScale(8), paddingVertical: hScale(2), borderRadius: wScale(6), marginBottom: hScale(4) },
  popularText: { fontSize: wScale(9), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF', letterSpacing: 0.5 },
  planLabel: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary },
  planPrice: { fontSize: wScale(22), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary, letterSpacing: -0.3 },
  planSub: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, textAlign: 'center' },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wScale(8),
    backgroundColor: colors.primary, borderRadius: wScale(16), paddingVertical: hScale(15), marginBottom: hScale(8),
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  ctaText: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansExtraBold, color: '#FFFFFF' },
  ctaNote: { textAlign: 'center', fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginBottom: hScale(20) },
  legal: { textAlign: 'center', fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, lineHeight: hScale(17) },
});
