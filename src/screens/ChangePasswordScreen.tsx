import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  TextInput, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isValid = current.length >= 6 && newPass.length >= 8 && newPass === confirm;

  const requirements = [
    { label: 'At least 8 characters', met: newPass.length >= 8 },
    { label: 'Passwords match', met: newPass === confirm && confirm.length > 0 },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: wScale(36) }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Iconify icon="solar:lock-password-bold" size={wScale(32)} color={colors.primary} />
          </View>
        </View>
        <Text style={styles.subtitle}>Keep your account secure with a strong password</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={current}
              onChangeText={setCurrent}
              placeholder="Enter current password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showCurrent}
            />
            <TouchableOpacity onPress={() => setShowCurrent(v => !v)} hitSlop={8}>
              <Iconify icon={showCurrent ? 'solar:eye-bold' : 'solar:eye-closed-bold'} size={wScale(18)} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={newPass}
              onChangeText={setNewPass}
              placeholder="Enter new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showNew}
            />
            <TouchableOpacity onPress={() => setShowNew(v => !v)} hitSlop={8}>
              <Iconify icon={showNew ? 'solar:eye-bold' : 'solar:eye-closed-bold'} size={wScale(18)} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Repeat new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={8}>
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
          onPress={() => isValid && navigation.goBack()}
          disabled={!isValid}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Update Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ChangePasswordScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
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
    backgroundColor: colors.inputBackground, borderRadius: wScale(14), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(12),
  },
  input: { flex: 1, fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary, padding: 0 },
  requirementsCard: {
    backgroundColor: colors.inputBackground, borderRadius: wScale(14), borderWidth: 1, borderColor: colors.stroke,
    padding: wScale(14), marginBottom: hScale(24), gap: hScale(8),
  },
  requirementRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(8) },
  requirementText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  saveBtn: {
    backgroundColor: colors.primary, borderRadius: wScale(16), paddingVertical: hScale(15), alignItems: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    marginTop: hScale(8),
  },
  saveBtnDisabled: { backgroundColor: colors.textSecondary, shadowOpacity: 0, elevation: 0 },
  saveBtnText: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF' },
});
