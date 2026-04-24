import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  TextInput, ScrollView, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useTranslation } from 'react-i18next';

import StackHeader from '../components/StackHeader/StackHeader';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import authService from '../services/auth';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValid = current.length >= 6 && newPass.length >= 8 && newPass === confirm;

  const requirements = [
    { label: t('changePassword.minChars'), met: newPass.length >= 8 },
    { label: t('changePassword.passwordsMatch'), met: newPass === confirm && confirm.length > 0 },
  ];

  const handleUpdate = async () => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      await authService.changePassword(current, newPass);
      Alert.alert('✓', 'Password changed successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message ?? 'Something went wrong. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StackHeader title={t('changePassword.title')} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Iconify icon="solar:lock-password-bold" size={wScale(32)} color={colors.primary} />
          </View>
        </View>
        <Text style={styles.subtitle}>{t('changePassword.subtitle')}</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('changePassword.currentPassword')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={current}
              onChangeText={setCurrent}
              placeholder={t('changePassword.enterCurrent')}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showCurrent}
              accessibilityLabel={t('changePassword.currentPassword')}
            />
            <TouchableOpacity
              onPress={() => setShowCurrent(v => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={showCurrent ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
            >
              <Iconify icon={showCurrent ? 'solar:eye-bold' : 'solar:eye-closed-bold'} size={wScale(18)} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('changePassword.newPassword')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={newPass}
              onChangeText={setNewPass}
              placeholder={t('changePassword.enterNew')}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showNew}
              accessibilityLabel={t('changePassword.newPassword')}
            />
            <TouchableOpacity
              onPress={() => setShowNew(v => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={showNew ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
            >
              <Iconify icon={showNew ? 'solar:eye-bold' : 'solar:eye-closed-bold'} size={wScale(18)} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{t('changePassword.confirmNewPassword')}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
              placeholder={t('changePassword.repeatNew')}
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showConfirm}
              accessibilityLabel={t('changePassword.confirmNewPassword')}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm(v => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={showConfirm ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
            >
              <Iconify icon={showConfirm ? 'solar:eye-bold' : 'solar:eye-closed-bold'} size={wScale(18)} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {newPass.length > 0 && (
          <View style={styles.requirementsCard}>
            {requirements.map(req => (
              <View key={req.label} style={styles.requirementRow}>
                <Iconify
                  icon={req.met ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                  size={wScale(16)}
                  color={req.met ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.requirementText, req.met && { color: colors.primary }]}>{req.label}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
          onPress={handleUpdate}
          disabled={!isValid || isLoading}
          activeOpacity={0.85}
          accessibilityLabel={t('changePassword.updatePassword')}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveBtnText}>{t('changePassword.updatePassword')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ChangePasswordScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(24), paddingBottom: hScale(40) },
  iconWrap: { alignItems: 'center', marginBottom: hScale(8) },
  iconCircle: {
    width: wScale(72), height: wScale(72), borderRadius: wScale(36),
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: hScale(12),
  },
  subtitle: {
    fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary,
    textAlign: 'center', marginBottom: hScale(28),
  },
  fieldGroup: { marginBottom: hScale(16) },
  label: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(8) },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.inputBackground, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(12),
  },
  input: { flex: 1, fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary, padding: 0 },
  requirementsCard: {
    backgroundColor: colors.inputBackground, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: colors.stroke,
    padding: wScale(14), marginBottom: hScale(24), gap: hScale(8),
  },
  requirementRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(8) },
  requirementText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  saveBtn: {
    backgroundColor: colors.primary, borderRadius: Layout.borderRadius.lg, paddingVertical: hScale(15), alignItems: 'center',
    ...Layout.shadow.md,
    shadowColor: colors.primary,
    marginTop: hScale(8),
  },
  saveBtnDisabled: { backgroundColor: colors.textSecondary, shadowOpacity: 0, elevation: 0 },
  saveBtnText: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF' },
});
