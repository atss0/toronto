import React, { useMemo } from 'react';
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

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly, such as account details (name, email, password), travel preferences, and route data. We also collect usage data and, with your permission, precise location information.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'Your data is used to personalize recommendations, improve the app experience, send relevant notifications, and provide customer support. We do not sell your personal data to third parties.',
  },
  {
    title: '3. Location Data',
    body: 'Location data is collected only when you grant permission. It is used to show nearby places and calculate routes. Background location is only used when you explicitly enable it.',
  },
  {
    title: '4. Data Security',
    body: 'We use industry-standard encryption to protect your data in transit and at rest. Access to personal data is restricted to authorized personnel only.',
  },
  {
    title: '5. Your Rights',
    body: 'You have the right to access, correct, or delete your personal data. You can request data export or account deletion through the app settings or by contacting our support team.',
  },
  {
    title: '6. Contact Us',
    body: 'For privacy-related inquiries, contact us at privacy@toronto-app.com. We respond to all requests within 30 business days.',
  },
];

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: wScale(36) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.lastUpdated}>Last updated: January 2025</Text>
        {SECTIONS.map(s => (
          <View key={s.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

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
  lastUpdated: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginBottom: hScale(24) },
  section: { marginBottom: hScale(20) },
  sectionTitle: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, marginBottom: hScale(8) },
  sectionBody: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, lineHeight: hScale(22) },
});
