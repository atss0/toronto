import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Iconify } from 'react-native-iconify';

import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useColors } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';

type RouteT = RouteProp<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const isValid = newPassword.length >= 8 && newPassword === confirmPassword;

  const handleReset = () => {
    if (!isValid) return;
    navigation.navigate('Login' as never);
  };

  return (
    <ScreenWrapper>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={10}
      >
        <Iconify icon="solar:arrow-left-linear" size={wScale(20)} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.iconArea}>
        <View style={[styles.iconOuterCircle, { backgroundColor: `${colors.primary}1A` }]}>
          <View style={[styles.iconInnerCircle, { backgroundColor: `${colors.primary}33` }]}>
            <Iconify icon="solar:lock-password-bold" size={wScale(36)} color={colors.primary} />
          </View>
        </View>
      </View>

      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>
        Create a strong new password for{'\n'}{route.params.email}
      </Text>

      <View style={styles.formArea}>
        <Input
          label="New Password"
          placeholder="Enter new password"
          isPassword
          value={newPassword}
          onChangeText={setNewPassword}
          leftIcon={<Iconify icon="solar:lock-bold" size={wScale(18)} color={colors.textSecondary} />}
        />
        <Input
          label="Confirm Password"
          placeholder="Repeat new password"
          isPassword
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          leftIcon={<Iconify icon="solar:lock-bold" size={wScale(18)} color={colors.textSecondary} />}
        />

        {newPassword.length > 0 && confirmPassword.length > 0 && !isValid && (
          <View style={styles.errorRow}>
            <Iconify icon="solar:close-circle-bold" size={wScale(14)} color="#EF4444" />
            <Text style={styles.errorText}>
              {newPassword.length < 8 ? 'Password must be at least 8 characters' : 'Passwords do not match'}
            </Text>
          </View>
        )}

        <Button
          title="Reset Password"
          onPress={handleReset}
          size="large"
          style={styles.button}
          rightIcon={<Iconify icon="solar:arrow-right-linear" size={wScale(18)} color={colors.white} />}
        />
      </View>
    </ScreenWrapper>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  backButton: {
    width: wScale(44), height: wScale(44), borderRadius: wScale(12),
    borderWidth: 1.5, borderColor: colors.stroke, borderStyle: 'dashed',
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start', marginBottom: hScale(48),
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  iconArea: { alignItems: 'center', marginBottom: hScale(32) },
  iconOuterCircle: { width: wScale(110), height: wScale(110), borderRadius: wScale(55), alignItems: 'center', justifyContent: 'center' },
  iconInnerCircle: { width: wScale(72), height: wScale(72), borderRadius: wScale(36), alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: wScale(26), fontFamily: Fonts.plusJakartaSansExtraBold,
    color: colors.textPrimary, textAlign: 'center', marginBottom: hScale(12),
  },
  subtitle: {
    fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary, textAlign: 'center', lineHeight: hScale(22),
    paddingHorizontal: wScale(8), marginBottom: hScale(40),
  },
  formArea: { gap: hScale(4) },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(6), paddingHorizontal: wScale(4) },
  errorText: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: '#EF4444' },
  button: { marginTop: hScale(12) },
});
