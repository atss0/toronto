import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';
import { setPreferences } from '../redux/UserSlice';
import premiumService, { PremiumStatus } from '../services/premium';

const FEATURE_ICONS = [
  'solar:map-arrow-right-bold',
  'solar:cloud-download-bold',
  'solar:star-bold',
  'solar:bell-bold',
  'solar:shield-bold',
];

const PremiumUpgradeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const colors = useColors();
  const { t } = useTranslation();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const reduxUser = useSelector((s: RootState) => s.User.user);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [status, setStatus] = useState<PremiumStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  const FEATURES = useMemo(() => FEATURE_ICONS.map((icon, i) => ({
    icon,
    label: t(`premium.feature${i + 1}Label`),
    desc: t(`premium.feature${i + 1}Desc`),
  })), [t]);

  const PLANS = useMemo(() => [
    { id: 'monthly' as const, label: t('premium.monthly'), price: t('premium.monthlyPrice'), sub: t('premium.monthlyPer'), popular: false },
    { id: 'annual' as const, label: t('premium.annual'), price: t('premium.annualPrice'), sub: t('premium.annualPer'), popular: true },
  ], [t]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await premiumService.getStatus();
      setStatus(res.data.data);
    } catch {
      // fall through — show upgrade UI on error
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSubscribe = async () => {
    if (subscribing) return;
    setSubscribing(true);
    try {
      /*
       * In production, initiate in-app purchase here (Apple/Google IAP or Stripe)
       * and pass the receipt/provider_sub_id returned by the payment SDK.
       * For now we send the plan+provider so the backend can be wired up end-to-end.
       */
      const res = await premiumService.subscribe({
        plan: selectedPlan,
        provider: 'stripe',
      });
      const result = res.data.data;
      dispatch(setPreferences({ is_premium: result.is_premium }));
      setStatus(prev => prev
        ? { ...prev, is_premium: result.is_premium, premium_expires_at: result.premium_expires_at }
        : null,
      );
      Alert.alert(
        t('premium.successTitle', 'Welcome to Premium!'),
        t('premium.successMessage', 'Your subscription is now active.'),
        [{ text: t('common.ok', 'OK'), onPress: () => navigation.goBack() }],
      );
    } catch (err: any) {
      const code = err?.response?.data?.error?.code;
      if (code === 'INVALID_RECEIPT') {
        Alert.alert(t('premium.errorTitle', 'Error'), t('premium.invalidReceipt', 'Payment could not be verified. Please try again.'));
      } else {
        Alert.alert(t('premium.errorTitle', 'Error'), t('premium.genericError', 'Something went wrong. Please try again.'));
      }
    } finally {
      setSubscribing(false);
    }
  };

  const isPremium = status?.is_premium ?? reduxUser?.is_premium ?? false;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

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

      {loadingStatus ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {isPremium ? (
            <View style={styles.alreadyPremiumCard}>
              <Iconify icon="solar:crown-bold" size={wScale(28)} color={colors.warning} />
              <Text style={styles.alreadyPremiumTitle}>{t('premium.alreadyPremium', 'You are already a Premium member!')}</Text>
              {status?.premium_expires_at && (
                <Text style={styles.alreadyPremiumSub}>
                  {t('premium.renewsOn', 'Renews on')}{' '}
                  {new Date(status.premium_expires_at).toLocaleDateString()}
                </Text>
              )}
              <View style={styles.featuresGrid}>
                {status?.features && (
                  <>
                    <View style={styles.featurePill}>
                      <Iconify icon="solar:chat-round-bold" size={wScale(14)} color={colors.primary} />
                      <Text style={styles.featurePillText}>
                        {status.features.ai_daily_limit == null
                          ? t('premium.unlimitedAI', 'Unlimited AI')
                          : `${status.features.ai_daily_limit} ${t('premium.aiPerDay', 'AI/day')}`}
                      </Text>
                    </View>
                    {status.features.offline_download && (
                      <View style={styles.featurePill}>
                        <Iconify icon="solar:cloud-download-bold" size={wScale(14)} color={colors.primary} />
                        <Text style={styles.featurePillText}>{t('premium.offlineRoutes', 'Offline Routes')}</Text>
                      </View>
                    )}
                    {status.features.advanced_filters && (
                      <View style={styles.featurePill}>
                        <Iconify icon="solar:filter-bold" size={wScale(14)} color={colors.primary} />
                        <Text style={styles.featurePillText}>{t('premium.advancedFilters', 'Advanced Filters')}</Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
          ) : (
            <>
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

              <TouchableOpacity
                style={[styles.cta, subscribing && styles.ctaDisabled]}
                activeOpacity={0.85}
                onPress={handleSubscribe}
                disabled={subscribing}
              >
                {subscribing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Iconify icon="solar:crown-bold" size={wScale(18)} color={colors.warning} />
                    <Text style={styles.ctaText}>{t('premium.startTrial')}</Text>
                  </>
                )}
              </TouchableOpacity>
              <Text style={styles.ctaNote}>{t('premium.trialNote')}</Text>
              <Text style={styles.legal}>{t('premium.legalNote')}</Text>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default PremiumUpgradeScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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

  alreadyPremiumCard: {
    alignItems: 'center',
    gap: hScale(10),
    backgroundColor: colors.white,
    borderRadius: wScale(20),
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: wScale(24),
    marginTop: hScale(24),
  },
  alreadyPremiumTitle: {
    fontSize: wScale(16),
    fontFamily: Fonts.plusJakartaSansBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  alreadyPremiumSub: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary,
  },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: wScale(8), justifyContent: 'center', marginTop: hScale(8) },
  featurePill: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(5),
    backgroundColor: colors.primaryLight, borderRadius: wScale(20),
    paddingHorizontal: wScale(12), paddingVertical: hScale(6),
  },
  featurePillText: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },

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
    minHeight: hScale(52),
  },
  ctaDisabled: { opacity: 0.7 },
  ctaText: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansExtraBold, color: '#FFFFFF' },
  ctaNote: { textAlign: 'center', fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginBottom: hScale(20) },
  legal: { textAlign: 'center', fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, lineHeight: hScale(17) },
});
