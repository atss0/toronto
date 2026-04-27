import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Iconify } from 'react-native-iconify';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import { RootState } from '../redux/store';
import { clearUser } from '../redux/UserSlice';
import { setLanguage } from '../redux/LanguageSlice';
import { tokenStorage } from '../storage/tokenStorage';
import authService from '../services/auth';
import { setTheme } from '../redux/ThemeSlice';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';

// ─── Setting Row ──────────────────────────────────────────────────────────────

interface SettingRowProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value?: string;
  onPress?: () => void;
  colors: AppColors;
  isLast?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = React.memo(({
  icon, iconBg, iconColor, label, value, onPress, colors, isLast,
}) => {
  const s = useMemo(() => makeRowStyles(colors), [colors]);
  return (
    <TouchableOpacity
      style={[s.row, !isLast && s.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[s.iconBox, { backgroundColor: iconBg }]}>
        <Iconify icon={icon} size={wScale(17)} color={iconColor} />
      </View>
      <Text style={s.label}>{label}</Text>
      <View style={s.right}>
        {value ? <Text style={s.value}>{value}</Text> : null}
        <Iconify icon="solar:alt-arrow-right-linear" size={wScale(16)} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
});

const makeRowStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hScale(13),
      gap: wScale(13),
    },
    rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.stroke,
    },
    iconBox: {
      width: wScale(38),
      height: wScale(38),
      borderRadius: wScale(11),
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      flex: 1,
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansMedium,
      color: colors.textPrimary,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(4),
    },
    value: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
    },
  });

// ─── Language / Theme Modal ───────────────────────────────────────────────────

interface PickerModalProps {
  visible: boolean;
  title: string;
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
  colors: AppColors;
}

const PickerModal: React.FC<PickerModalProps> = ({
  visible, title, options, selected, onSelect, onClose, colors,
}) => {
  const s = useMemo(() => makeModalStyles(colors), [colors]);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable style={s.sheet} onPress={() => { }}>
          <Text style={s.sheetTitle}>{title}</Text>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={opt.value}
              style={[s.optionRow, i < options.length - 1 && s.optionBorder]}
              onPress={() => { onSelect(opt.value); onClose(); }}
              activeOpacity={0.7}
            >
              <Text style={[s.optionLabel, selected === opt.value && s.optionLabelActive]}>
                {opt.label}
              </Text>
              {selected === opt.value && (
                <Iconify icon="solar:check-circle-bold" size={wScale(18)} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const makeModalStyles = (colors: AppColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.white,
      borderTopLeftRadius: wScale(24),
      borderTopRightRadius: wScale(24),
      paddingHorizontal: Layout.screenPaddingH,
      paddingTop: hScale(24),
      paddingBottom: hScale(40),
    },
    sheetTitle: {
      fontSize: wScale(16),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.textPrimary,
      marginBottom: hScale(16),
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: hScale(14),
    },
    optionBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.stroke,
    },
    optionLabel: {
      fontSize: wScale(15),
      fontFamily: Fonts.plusJakartaSansMedium,
      color: colors.textPrimary,
    },
    optionLabelActive: {
      color: colors.primary,
      fontFamily: Fonts.plusJakartaSansBold,
    },
  });

// ─── Section Card ─────────────────────────────────────────────────────────────

const SectionCard: React.FC<{
  title: string;
  children: React.ReactNode;
  colors: AppColors;
}> = ({ title, children, colors }) => {
  const s = useMemo(() => makeSectionStyles(colors), [colors]);
  return (
    <View style={s.wrap}>
      <Text style={s.title}>{title}</Text>
      <View style={s.card}>{children}</View>
    </View>
  );
};

const makeSectionStyles = (colors: AppColors) =>
  StyleSheet.create({
    wrap: {
      marginBottom: hScale(20),
      paddingHorizontal: Layout.screenPaddingH,
    },
    title: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: hScale(10),
      paddingHorizontal: wScale(2),
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: wScale(18),
      paddingHorizontal: wScale(16),
      borderWidth: 1,
      borderColor: colors.stroke,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
  });

// ─── Main Screen ──────────────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const user = useSelector((s: RootState) => s.User.user);
  const currentLang = useSelector((s: RootState) => s.Language.lang);
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);

  const [langModal, setLangModal] = useState(false);
  const [themeModal, setThemeModal] = useState(false);

  const displayName = user ? `${user.name} ${user.surname ?? ''}`.trim() : 'Alex Johnson';
  const initials = user?.name
    ? `${user.name[0]}${user.surname?.[0] ?? ''}`.toUpperCase()
    : 'AJ';

  const langLabel = currentLang === 'tr' ? 'Turkish' : 'English';
  const themeLabel = currentTheme === 'dark' ? 'Dark' : 'Light';

  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.inputBackground}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* ── Avatar & Name ─────────────────────────────────────────────────── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <TouchableOpacity style={styles.cameraBtn}>
              <Iconify icon="solar:camera-bold" size={wScale(13)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.displayRole}>{t('profile.placesVisited', { count: 45 })}</Text>

          <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editProfileText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <View style={styles.statsCard}>
          {[
            { value: '12', label: 'ROUTES' },
            { value: '45', label: 'PLACES' },
            { value: '8', label: 'CITIES' },
          ].map((stat, i, arr) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Premium Card ──────────────────────────────────────────────────── */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumTop}>
            <View style={styles.premiumIconWrap}>
              <Iconify icon="solar:crown-bold" size={wScale(20)} color={colors.warning} />
            </View>
            <Text style={styles.premiumTitle}>
              {user?.is_premium ? 'Premium Member' : 'Go Premium'}
            </Text>
            {user?.is_premium && (
              <View style={styles.premiumActiveBadge}>
                <Text style={styles.premiumActiveBadgeText}>ACTIVE</Text>
              </View>
            )}
          </View>

          {[
            'Unlimited AI planning',
            'Offline routes access',
            'Smart recommendations',
          ].map(item => (
            <View key={item} style={styles.premiumFeatureRow}>
              <Iconify
                icon={user?.is_premium ? 'solar:check-circle-bold' : 'solar:lock-bold'}
                size={wScale(15)}
                color="rgba(255,255,255,0.85)"
              />
              <Text style={styles.premiumFeatureText}>{item}</Text>
            </View>
          ))}

          {!user?.is_premium && (
            <TouchableOpacity style={styles.upgradeBtn} activeOpacity={0.85} onPress={() => navigation.navigate('PremiumUpgrade')}>
              <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Account Settings ──────────────────────────────────────────────── */}
        <SectionCard title={t('profile.accountSettings')} colors={colors}>
          <SettingRow
            icon="solar:global-bold"
            iconBg={colors.primaryLight}
            iconColor={colors.primary}
            label={t('profile.language')}
            value={langLabel}
            onPress={() => setLangModal(true)}
            colors={colors}
          />
          <SettingRow
            icon="solar:dollar-minimalistic-bold"
            iconBg="#D1FAE5"
            iconColor="#10B981"
            label={t('profile.currency')}
            value="USD"
            onPress={() => navigation.navigate('CurrencySettings')}
            colors={colors}
          />
          <SettingRow
            icon="solar:bell-bold"
            iconBg={colors.warningLight}
            iconColor={colors.warning}
            label={t('profile.notifications')}
            onPress={() => navigation.navigate('NotificationSettings')}
            colors={colors}
          />
          <SettingRow
            icon="solar:map-point-bold"
            iconBg="#FFE4E6"
            iconColor="#EF4444"
            label={t('profile.locationAccess')}
            onPress={() => navigation.navigate('LocationSettings')}
            colors={colors}
          />
          <SettingRow
            icon="solar:history-bold"
            iconBg={colors.primaryLight}
            iconColor={colors.primary}
            label={t('profile.tripHistory')}
            onPress={() => navigation.navigate('TripHistory')}
            colors={colors}
            isLast
          />
        </SectionCard>

        {/* ── Travel Preferences ────────────────────────────────────────────── */}
        <SectionCard title={t('profile.travelPreferences')} colors={colors}>
          <SettingRow
            icon="solar:heart-bold"
            iconBg="#FFE4E6"
            iconColor="#EF4444"
            label={t('profile.interests')}
            value="Nature, Food"
            onPress={() => navigation.navigate('Interests')}
            colors={colors}
          />
          <SettingRow
            icon="solar:wallet-bold"
            iconBg="#D1FAE5"
            iconColor="#10B981"
            label={t('profile.budgetLevel')}
            value="Mid-range"
            onPress={() => navigation.navigate('BudgetSettings')}
            colors={colors}
          />
          <SettingRow
            icon="solar:user-bold"
            iconBg={colors.primaryLight}
            iconColor={colors.primary}
            label={t('profile.travelStyle')}
            value="Solo"
            onPress={() => navigation.navigate('TravelStyle')}
            colors={colors}
            isLast
          />
        </SectionCard>

        {/* ── Security ──────────────────────────────────────────────────────── */}
        <SectionCard title="Security" colors={colors}>
          <SettingRow
            icon="solar:lock-password-bold"
            iconBg={colors.primaryLight}
            iconColor={colors.primary}
            label="Change Password"
            onPress={() => navigation.navigate('ChangePassword')}
            colors={colors}
            isLast
          />
        </SectionCard>

        {/* ── Appearance ────────────────────────────────────────────────────── */}
        <SectionCard title="Appearance" colors={colors}>
          <SettingRow
            icon={currentTheme === 'dark' ? 'solar:moon-bold' : 'solar:sun-bold-duotone'}
            iconBg={colors.warningLight}
            iconColor={colors.warning}
            label="Theme"
            value={themeLabel}
            onPress={() => setThemeModal(true)}
            colors={colors}
            isLast
          />
        </SectionCard>

        {/* ── Support ───────────────────────────────────────────────────────── */}
        <SectionCard title={t('profile.support')} colors={colors}>
          <SettingRow
            icon="solar:question-circle-bold"
            iconBg={colors.primaryLight}
            iconColor={colors.primary}
            label={t('profile.helpCenter')}
            onPress={() => navigation.navigate('HelpCenter')}
            colors={colors}
          />
          <SettingRow
            icon="solar:shield-bold"
            iconBg="#D1FAE5"
            iconColor="#10B981"
            label={t('profile.privacyPolicy')}
            onPress={() => navigation.navigate('PrivacyPolicy')}
            colors={colors}
          />
          <SettingRow
            icon="solar:document-text-bold"
            iconBg={colors.warningLight}
            iconColor={colors.warning}
            label={t('profile.termsOfService')}
            onPress={() => navigation.navigate('TermsOfService')}
            colors={colors}
            isLast
          />
        </SectionCard>

        {/* ── Logout ────────────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            const refreshToken = tokenStorage.getRefreshToken();
            await tokenStorage.clear();
            dispatch(clearUser());
            if (refreshToken) {
              authService.logout(refreshToken).catch(() => {});
            }
          }}
          activeOpacity={0.8}
        >
          <Iconify icon="solar:logout-2-bold" size={wScale(18)} color={colors.danger} />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        {/* ── Version ───────────────────────────────────────────────────────── */}
        <Text style={styles.version}>{t('profile.version')} ({currentYear})</Text>

      </ScrollView>

      {/* ── Language Modal ───────────────────────────────────────────────────── */}
      <PickerModal
        visible={langModal}
        title="Select Language"
        options={[
          { label: 'English', value: 'en' },
          { label: 'Turkish', value: 'tr' },
        ]}
        selected={currentLang}
        onSelect={v => dispatch(setLanguage(v as 'en' | 'tr'))}
        onClose={() => setLangModal(false)}
        colors={colors}
      />

      {/* ── Theme Modal ──────────────────────────────────────────────────────── */}
      <PickerModal
        visible={themeModal}
        title="Select Theme"
        options={[
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
        selected={currentTheme}
        onSelect={v => dispatch(setTheme(v as 'light' | 'dark'))}
        onClose={() => setThemeModal(false)}
        colors={colors}
      />
    </View>
  );
};

export default ProfileScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      paddingBottom: hScale(48),
    },

    // Header
    header: {
      paddingHorizontal: Layout.screenPaddingH,
      paddingTop: hScale(20),
      paddingBottom: hScale(8),
      backgroundColor: colors.inputBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.stroke,
    },
    headerTitle: {
      fontSize: wScale(26),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },

    // Avatar
    avatarSection: {
      alignItems: 'center',
      paddingTop: hScale(28),
      paddingBottom: hScale(24),
      backgroundColor: colors.inputBackground,
    },
    avatarWrap: {
      position: 'relative',
      marginBottom: hScale(14),
    },
    avatarCircle: {
      width: wScale(88),
      height: wScale(88),
      borderRadius: wScale(44),
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.primary,
    },
    avatarInitials: {
      fontSize: wScale(28),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.primary,
    },
    cameraBtn: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: wScale(26),
      height: wScale(26),
      borderRadius: wScale(13),
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.white,
    },
    displayName: {
      fontSize: wScale(20),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
      letterSpacing: -0.2,
      marginBottom: hScale(3),
    },
    displayRole: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
      marginBottom: hScale(14),
    },
    editProfileBtn: {
      paddingHorizontal: wScale(24),
      paddingVertical: hScale(9),
      borderRadius: wScale(20),
      borderWidth: 1.5,
      borderColor: colors.stroke,
      backgroundColor: colors.white,
    },
    editProfileText: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.textPrimary,
    },

    // Stats
    statsCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      marginHorizontal: Layout.screenPaddingH,
      marginTop: hScale(20),
      marginBottom: hScale(16),
      borderRadius: wScale(18),
      paddingVertical: hScale(18),
      borderWidth: 1,
      borderColor: colors.stroke,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      gap: hScale(4),
    },
    statValue: {
      fontSize: wScale(22),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    statLabel: {
      fontSize: wScale(10),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.textSecondary,
      letterSpacing: 0.8,
    },
    statDivider: {
      width: 1,
      height: hScale(32),
      backgroundColor: colors.stroke,
    },

    // Premium
    premiumCard: {
      marginHorizontal: Layout.screenPaddingH,
      marginBottom: hScale(28),
      borderRadius: wScale(20),
      backgroundColor: colors.primary,
      padding: wScale(20),
      gap: hScale(10),
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 6,
    },
    premiumTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(10),
      marginBottom: hScale(2),
      flexWrap: 'wrap',
    },
    premiumActiveBadge: {
      backgroundColor: 'rgba(255,255,255,0.22)',
      paddingHorizontal: wScale(8),
      paddingVertical: hScale(2),
      borderRadius: wScale(6),
    },
    premiumActiveBadgeText: {
      fontSize: wScale(9),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
      letterSpacing: 0.8,
    },
    premiumIconWrap: {
      width: wScale(34),
      height: wScale(34),
      borderRadius: wScale(10),
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    premiumTitle: {
      fontSize: wScale(16),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
    },
    premiumFeatureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(8),
    },
    premiumFeatureText: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: 'rgba(255,255,255,0.85)',
    },
    upgradeBtn: {
      backgroundColor: '#FFFFFF',
      borderRadius: wScale(14),
      paddingVertical: hScale(13),
      alignItems: 'center',
      marginTop: hScale(6),
    },
    upgradeBtnText: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.primary,
    },

    // Sections wrapper padding
    // (SectionCard handles its own layout)

    // Logout
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: wScale(8),
      marginHorizontal: Layout.screenPaddingH,
      marginBottom: hScale(16),
      paddingVertical: hScale(14),
      borderRadius: wScale(16),
      backgroundColor: colors.dangerLight,
      borderWidth: 1,
      borderColor: `${colors.danger}30`,
    },
    logoutText: {
      fontSize: wScale(15),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.danger,
    },

    // Version
    version: {
      textAlign: 'center',
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
    },
  });
