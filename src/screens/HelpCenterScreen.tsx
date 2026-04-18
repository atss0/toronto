import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

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
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
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
});
