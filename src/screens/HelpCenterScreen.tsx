import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking } from 'react-native';
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

const EMERGENCY_NUMBERS = [
  { region: 'Europe', number: '112', desc: 'Universal EU emergency' },
  { region: 'USA / Canada', number: '911', desc: 'Police, fire, ambulance' },
  { region: 'UK', number: '999', desc: 'Police, fire, ambulance' },
  { region: 'Australia', number: '000', desc: 'Police, fire, ambulance' },
  { region: 'Japan', number: '110 / 119', desc: 'Police / Ambulance & fire' },
];

const SAFETY_TIPS = [
  'Keep a digital copy of your passport in cloud storage.',
  'Note your country\'s local embassy address before arrival.',
  'Share your daily itinerary with someone you trust.',
  'Keep emergency cash separate from your main wallet.',
  'Save the local emergency number as a contact immediately.',
];

const FAQ = [
  { q: 'How do I create a new route?', a: 'Go to the Routes tab and tap "Create New Route". You can add stops, set a start point, and the app will calculate the best path for you.' },
  { q: 'Can I use the app offline?', a: 'Premium users can download routes for offline use. Free users require an internet connection to access maps and recommendations.' },
  { q: 'How does the AI assistant work?', a: 'Belen uses AI to analyze your preferences, location, and time to suggest personalized travel routes and hidden gems in any city.' },
  { q: 'How do I change my location?', a: 'Tap the city chip in the Home screen header or go to Profile → Account Settings → Location Access to change your default city.' },
  { q: 'How do I delete a saved route?', a: 'In the Routes tab, swipe left on any saved route to reveal the delete option, or open the route details and tap the delete icon.' },
];

const HelpCenterScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const { t } = useTranslation();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('legal.helpCenter')}</Text>
        <View style={{ width: wScale(36) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Contact Cards */}
        <View style={styles.contactRow}>
          {[
            { icon: 'solar:chat-round-line-linear', label: 'Live Chat', color: colors.primary, bg: colors.primaryLight },
            { icon: 'solar:letter-linear', label: 'Email Us', color: colors.success, bg: colors.successLight },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.contactCard} activeOpacity={0.8}>
              <View style={[styles.contactIcon, { backgroundColor: item.bg }]}>
                <Iconify icon={item.icon} size={wScale(22)} color={item.color} />
              </View>
              <Text style={styles.contactLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Section */}
        <Text style={styles.sectionLabel}>EMERGENCY & SAFETY</Text>
        <TouchableOpacity
          style={styles.emergencyBanner}
          activeOpacity={0.85}
          onPress={() => setEmergencyOpen(v => !v)}
        >
          <View style={styles.emergencyBannerLeft}>
            <View style={styles.emergencyIcon}>
              <Iconify icon="solar:danger-bold" size={wScale(22)} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.emergencyBannerTitle}>Emergency Numbers</Text>
              <Text style={styles.emergencyBannerSub}>Global emergency contacts by region</Text>
            </View>
          </View>
          <Iconify
            icon={emergencyOpen ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
            size={wScale(16)}
            color="#EF4444"
          />
        </TouchableOpacity>
        {emergencyOpen && (
          <View style={styles.emergencyCard}>
            {EMERGENCY_NUMBERS.map((item, i) => (
              <TouchableOpacity
                key={item.region}
                style={[styles.emergencyRow, i < EMERGENCY_NUMBERS.length - 1 && styles.emergencyBorder]}
                onPress={() => Linking.openURL(`tel:${item.number.split(' / ')[0]}`)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.emergencyRegion}>{item.region}</Text>
                  <Text style={styles.emergencyDesc}>{item.desc}</Text>
                </View>
                <View style={styles.emergencyNumWrap}>
                  <Text style={styles.emergencyNum}>{item.number}</Text>
                  <Iconify icon="solar:phone-bold" size={wScale(13)} color="#EF4444" />
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.safetyTipsWrap}>
              <Text style={styles.safetyTipsTitle}>Safety Tips</Text>
              {SAFETY_TIPS.map((tip, i) => (
                <View key={i} style={styles.safetyTipRow}>
                  <Iconify icon="solar:check-circle-bold" size={wScale(14)} color="#10B981" />
                  <Text style={styles.safetyTipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* FAQ */}
        <Text style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
        <View style={styles.faqCard}>
          {FAQ.map((item, i) => {
            const isOpen = expandedIndex === i;
            return (
              <View key={i} style={[styles.faqItem, i < FAQ.length - 1 && styles.faqBorder]}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => setExpandedIndex(isOpen ? null : i)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQ}>{item.q}</Text>
                  <Iconify
                    icon={isOpen ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                    size={wScale(16)}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                {isOpen && <Text style={styles.faqA}>{item.a}</Text>}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpCenterScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  scroll: { padding: Layout.screenPaddingH, gap: hScale(16), paddingBottom: hScale(40) },
  contactRow: { flexDirection: 'row', gap: wScale(12) },
  contactCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: wScale(16), borderWidth: 1, borderColor: colors.stroke,
    padding: wScale(16), alignItems: 'center', gap: hScale(8),
  },
  contactIcon: { width: wScale(48), height: wScale(48), borderRadius: wScale(14), alignItems: 'center', justifyContent: 'center' },
  contactLabel: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  sectionLabel: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansBold, color: colors.textSecondary, letterSpacing: 1 },
  faqCard: { backgroundColor: colors.white, borderRadius: wScale(18), borderWidth: 1, borderColor: colors.stroke, paddingHorizontal: wScale(16) },
  faqItem: { paddingVertical: hScale(14) },
  faqBorder: { borderBottomWidth: 1, borderBottomColor: colors.stroke },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: wScale(10) },
  faqQ: { flex: 1, fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textPrimary, lineHeight: hScale(20) },
  faqA: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, lineHeight: hScale(20), marginTop: hScale(8) },

  // Emergency
  emergencyBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FEF2F2', borderRadius: wScale(16), borderWidth: 1, borderColor: '#FECACA',
    padding: wScale(14),
  },
  emergencyBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: wScale(12) },
  emergencyIcon: {
    width: wScale(44), height: wScale(44), borderRadius: wScale(12),
    backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center',
  },
  emergencyBannerTitle: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: '#EF4444' },
  emergencyBannerSub: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: '#9CA3AF', marginTop: hScale(1) },
  emergencyCard: {
    backgroundColor: colors.white, borderRadius: wScale(18), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(16), overflow: 'hidden',
  },
  emergencyRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: hScale(12),
  },
  emergencyBorder: { borderBottomWidth: 1, borderBottomColor: colors.stroke },
  emergencyRegion: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary },
  emergencyDesc: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginTop: hScale(1) },
  emergencyNumWrap: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(6),
    backgroundColor: '#FEF2F2', paddingHorizontal: wScale(10), paddingVertical: hScale(5),
    borderRadius: wScale(10),
  },
  emergencyNum: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansBold, color: '#EF4444' },
  safetyTipsWrap: {
    borderTopWidth: 1, borderTopColor: colors.stroke,
    paddingVertical: hScale(14), gap: hScale(8),
  },
  safetyTipsTitle: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansBold, color: colors.textSecondary, letterSpacing: 0.5, marginBottom: hScale(4) },
  safetyTipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wScale(8) },
  safetyTipText: { flex: 1, fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, lineHeight: hScale(18) },
});
