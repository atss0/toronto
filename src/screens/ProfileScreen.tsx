import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Iconify } from 'react-native-iconify';

import { RootState } from '../redux/store';
import { setLanguage } from '../redux/LanguageSlice';
import { setTheme } from '../redux/ThemeSlice';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const currentLang = useSelector((s: RootState) => s.Language.lang);
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Avatar ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Iconify icon="solar:user-bold" size={wScale(40)} color={colors.primary} />
          </View>
          <Text style={styles.avatarName}>Traveler</Text>
          <Text style={styles.avatarSub}>traveler@toronto.app</Text>
        </View>

        {/* ── Settings Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('profile.settings')}</Text>

          {/* Language Row */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIconBox, { backgroundColor: colors.primaryLight }]}>
              <Iconify icon="solar:global-bold" size={wScale(18)} color={colors.primary} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>{t('profile.language')}</Text>
              <Text style={styles.settingSubtitle}>{t('profile.languageSubtitle')}</Text>
            </View>
          </View>

          <View style={styles.segmentRow}>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                currentLang === 'en' && styles.segmentBtnActive,
              ]}
              onPress={() => dispatch(setLanguage('en'))}
              activeOpacity={0.75}
            >
              <Text style={[
                styles.segmentBtnText,
                currentLang === 'en' && styles.segmentBtnTextActive,
              ]}>
                {t('profile.en')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                currentLang === 'tr' && styles.segmentBtnActive,
              ]}
              onPress={() => dispatch(setLanguage('tr'))}
              activeOpacity={0.75}
            >
              <Text style={[
                styles.segmentBtnText,
                currentLang === 'tr' && styles.segmentBtnTextActive,
              ]}>
                {t('profile.tr')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Theme Row */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIconBox, { backgroundColor: colors.warningLight }]}>
              <Iconify
                icon={currentTheme === 'dark' ? 'solar:moon-bold' : 'solar:sun-bold'}
                size={wScale(18)}
                color={colors.warning}
              />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>{t('profile.theme')}</Text>
              <Text style={styles.settingSubtitle}>{t('profile.themeSubtitle')}</Text>
            </View>
          </View>

          <View style={styles.segmentRow}>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                styles.segmentBtnIcon,
                currentTheme === 'light' && styles.segmentBtnActive,
              ]}
              onPress={() => dispatch(setTheme('light'))}
              activeOpacity={0.75}
            >
              <Iconify
                icon="solar:sun-bold"
                size={wScale(15)}
                color={currentTheme === 'light' ? '#FFFFFF' : colors.textSecondary}
              />
              <Text style={[
                styles.segmentBtnText,
                currentTheme === 'light' && styles.segmentBtnTextActive,
              ]}>
                {t('profile.light')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                styles.segmentBtnIcon,
                currentTheme === 'dark' && styles.segmentBtnActive,
              ]}
              onPress={() => dispatch(setTheme('dark'))}
              activeOpacity={0.75}
            >
              <Iconify
                icon="solar:moon-bold"
                size={wScale(15)}
                color={currentTheme === 'dark' ? '#FFFFFF' : colors.textSecondary}
              />
              <Text style={[
                styles.segmentBtnText,
                currentTheme === 'dark' && styles.segmentBtnTextActive,
              ]}>
                {t('profile.dark')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: hScale(16),
    paddingBottom: hScale(16),
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: wScale(24),
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: hScale(90),
  },

  // ── Avatar ──
  avatarSection: {
    alignItems: 'center',
    paddingVertical: hScale(28),
  },
  avatarCircle: {
    width: wScale(88),
    height: wScale(88),
    borderRadius: wScale(44),
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hScale(14),
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarName: {
    fontSize: wScale(20),
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: hScale(4),
  },
  avatarSub: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary,
  },

  // ── Settings Card ──
  card: {
    backgroundColor: colors.white,
    borderRadius: wScale(20),
    padding: wScale(20),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  cardTitle: {
    fontSize: wScale(12),
    fontFamily: Fonts.plusJakartaSansBold,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: hScale(18),
  },

  // ── Setting Row ──
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(14),
    marginBottom: hScale(14),
  },
  settingIconBox: {
    width: wScale(40),
    height: wScale(40),
    borderRadius: wScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
    gap: hScale(2),
  },
  settingLabel: {
    fontSize: wScale(15),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: wScale(12),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary,
  },

  // ── Segment Control ──
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: wScale(14),
    padding: wScale(4),
    gap: wScale(4),
    marginBottom: hScale(8),
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: hScale(10),
    borderRadius: wScale(11),
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnIcon: {
    flexDirection: 'row',
    gap: wScale(6),
  },
  segmentBtnActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentBtnText: {
    fontSize: wScale(14),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: colors.textSecondary,
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
  },

  divider: {
    height: 1,
    backgroundColor: colors.stroke,
    marginVertical: hScale(16),
  },
});
