import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Dimensions, Animated, Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types/navigation';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';

type RouteT = RouteProp<RootStackParamList, 'Navigation'>;
const { width: W, height: H } = Dimensions.get('window');

const MOCK_STEPS = [
  { instruction: 'Head northwest on Sultanahmet Meydanı', distance: '120 m', icon: 'solar:arrow-up-bold' },
  { instruction: 'Turn right onto Divan Yolu Caddesi', distance: '350 m', icon: 'solar:arrow-right-bold' },
  { instruction: 'Turn left towards Yerebatan Caddesi', distance: '80 m', icon: 'solar:arrow-left-bold' },
  { instruction: 'Arrive at Basilica Cistern on the left', distance: '', icon: 'solar:map-point-bold' },
];

const NavigationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const step = MOCK_STEPS[currentStep];

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    if (isActive) pulse.start();
    return () => pulse.stop();
  }, [isActive]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Full map area */}
      <View style={styles.mapArea}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.mapBackground }]} />

        {/* Grid */}
        {useMemo(() => Array.from({ length: 24 }, (_, i) => ({
          top: (Math.floor(i / 4) * 0.15 + 0.05),
          left: ((i % 4) * 0.22 + 0.05),
        })), []).map((b, i) => (
          <View key={i} style={{ position: 'absolute', top: b.top * H * 0.6, left: b.left * W, width: W * 0.17, height: H * 0.09, borderRadius: wScale(5), backgroundColor: colors.mapGrid, opacity: 0.6 }} />
        ))}

        {/* Route line */}
        <View style={[styles.routeLine, { top: H * 0.2, left: W * 0.15, width: W * 0.6 }]} />
        <View style={[styles.routeLineV, { top: H * 0.2, left: W * 0.15 + W * 0.6 - wScale(3) }]} />

        {/* User location dot */}
        <View style={[styles.userDotWrap, { top: H * 0.25, left: W * 0.15 - wScale(8) }]}>
          <Animated.View style={[styles.userPulse, { transform: [{ scale: pulseAnim }], backgroundColor: `${colors.primary}30` }]} />
          <View style={styles.userDot} />
        </View>

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel={t('common.goBack')}
          accessibilityRole="button"
        >
          <Iconify icon="solar:close-circle-bold" size={wScale(18)} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Panel */}
      <View style={styles.panel}>
        {/* Current instruction */}
        <View style={styles.instructionCard}>
          <View style={styles.instructionIcon}>
            <Iconify icon={step.icon} size={wScale(22)} color="#FFFFFF" />
          </View>
          <View style={styles.instructionInfo}>
            <Text style={styles.instructionText}>{step.instruction}</Text>
            {step.distance ? (
              <Text style={styles.distanceText}>In {step.distance}</Text>
            ) : null}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { icon: 'solar:clock-circle-linear', label: t('navigation.eta'), value: '18 min' },
            { icon: 'solar:walking-bold', label: t('navigation.remaining'), value: '1.2 km' },
            { icon: 'solar:map-point-linear', label: t('navigation.nextStop'), value: MOCK_STEPS[Math.min(currentStep + 1, MOCK_STEPS.length - 1)].instruction.split(' ').slice(0, 3).join(' ') + '...' },
          ].map(stat => (
            <View key={stat.label} style={styles.statItem}>
              <Iconify icon={stat.icon} size={wScale(14)} color={colors.textSecondary} />
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue} numberOfLines={1}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* Step navigation */}
        <View style={styles.stepNav}>
          <TouchableOpacity
            style={[styles.stepBtn, currentStep === 0 && styles.stepBtnDisabled]}
            onPress={() => setCurrentStep(i => Math.max(0, i - 1))}
            disabled={currentStep === 0}
            accessibilityLabel={t('navigation.prev')}
            accessibilityRole="button"
          >
            <Iconify icon="solar:alt-arrow-left-linear" size={wScale(18)} color={currentStep === 0 ? colors.textSecondary : colors.primary} />
            <Text style={[styles.stepBtnText, currentStep === 0 && { color: colors.textSecondary }]}>{t('navigation.prev')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={() => Alert.alert(
              t('navigation.endConfirmTitle'),
              t('navigation.endConfirmMessage'),
              [
                { text: t('navigation.endConfirmNo'), style: 'cancel' },
                { text: t('navigation.endConfirmYes'), style: 'destructive', onPress: () => navigation.goBack() },
              ],
            )}
            activeOpacity={0.8}
            accessibilityLabel={t('navigation.endNavigation')}
            accessibilityRole="button"
          >
            <Text style={styles.endBtnText}>{t('navigation.endNavigation')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stepBtn, currentStep === MOCK_STEPS.length - 1 && styles.stepBtnDisabled]}
            onPress={() => setCurrentStep(i => Math.min(MOCK_STEPS.length - 1, i + 1))}
            disabled={currentStep === MOCK_STEPS.length - 1}
            accessibilityLabel={t('navigation.next')}
            accessibilityRole="button"
          >
            <Text style={[styles.stepBtnText, currentStep === MOCK_STEPS.length - 1 && { color: colors.textSecondary }]}>{t('navigation.next')}</Text>
            <Iconify icon="solar:alt-arrow-right-linear" size={wScale(18)} color={currentStep === MOCK_STEPS.length - 1 ? colors.textSecondary : colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NavigationScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mapArea: { flex: 1, position: 'relative' },
  routeLine: { position: 'absolute', height: hScale(4), backgroundColor: colors.primary, borderRadius: 2, opacity: 0.9 },
  routeLineV: { position: 'absolute', width: hScale(4), height: H * 0.15, backgroundColor: colors.primary, borderRadius: 2, opacity: 0.9 },
  userDotWrap: { position: 'absolute', alignItems: 'center', justifyContent: 'center', width: wScale(24), height: wScale(24) },
  userPulse: { position: 'absolute', width: wScale(30), height: wScale(30), borderRadius: wScale(15) },
  userDot: { width: wScale(16), height: wScale(16), borderRadius: wScale(8), backgroundColor: colors.primary, borderWidth: 3, borderColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  closeBtn: {
    position: 'absolute', top: Layout.translucentTopOffset, right: wScale(16),
    width: Layout.hitArea.backButton, height: Layout.hitArea.backButton, borderRadius: Layout.borderRadius.sm,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.stroke, ...Layout.shadow.sm,
  },
  panel: {
    backgroundColor: colors.white, borderTopLeftRadius: wScale(24), borderTopRightRadius: wScale(24),
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(20), paddingBottom: hScale(32),
    gap: hScale(16), borderTopWidth: 1, borderTopColor: colors.stroke,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 8,
  },
  instructionCard: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(14),
    backgroundColor: colors.primary, borderRadius: wScale(16), padding: wScale(14),
  },
  instructionIcon: { width: wScale(44), height: wScale(44), borderRadius: wScale(12), backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  instructionInfo: { flex: 1 },
  instructionText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF', lineHeight: hScale(20) },
  distanceText: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: 'rgba(255,255,255,0.85)', marginTop: hScale(3) },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.inputBackground,
    borderRadius: wScale(16), padding: wScale(14), gap: wScale(4),
  },
  statItem: { flex: 1, alignItems: 'center', gap: hScale(3) },
  statLabel: { fontSize: wScale(10), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary, letterSpacing: 0.3 },
  statValue: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, textAlign: 'center' },
  stepNav: { flexDirection: 'row', alignItems: 'center', gap: wScale(10) },
  stepBtn: { flexDirection: 'row', alignItems: 'center', gap: wScale(4), paddingVertical: hScale(10), paddingHorizontal: wScale(8) },
  stepBtnDisabled: { opacity: 0.4 },
  stepBtnText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },
  endBtn: {
    flex: 1, backgroundColor: colors.dangerLight, borderRadius: wScale(14),
    paddingVertical: hScale(13), alignItems: 'center', borderWidth: 1, borderColor: `${colors.danger}30`,
  },
  endBtnText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.danger },
});
