import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Fonts from '../../styles/Fonts';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AuthHeader from '../../components/AuthHeader';
import AuthDivider from '../../components/AuthDivider';
import SocialLogins from '../../components/SocialLogins';
import { hScale, wScale } from '../../styles/Scaler';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useColors } from '../../context/ThemeContext';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors.primary, colors.textSecondary), [colors]);

  const handleRegister = () => {
    if (password !== confirmPassword) return;
    // TODO: call authService.register({ name: fullName, email, password }) when backend is ready
  };

  return (
    <ScreenWrapper scrollable>
      <AuthHeader
        title={t('auth.registerTitle')}
        subtitle={t('auth.registerSubtitle')}
      />

      <View style={styles.formContainer}>
        <Input
          label={t('auth.fullNameLabel')}
          placeholder={t('auth.fullNamePlaceholder')}
          autoCapitalize="words"
          value={fullName}
          onChangeText={setFullName}
        />
        <Input
          label={t('auth.emailLabel')}
          placeholder={t('auth.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label={t('auth.passwordLabel')}
          placeholder={t('auth.passwordPlaceholder')}
          isPassword
          value={password}
          onChangeText={setPassword}
        />
        <Input
          label={t('auth.confirmPasswordLabel')}
          placeholder={t('auth.confirmPasswordPlaceholder')}
          isPassword
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          containerStyle={styles.lastInput}
        />

        <Button
          title={t('auth.registerButton')}
          onPress={handleRegister}
          size="large"
          style={styles.registerButton}
        />
      </View>

      <AuthDivider text={t('auth.orContinueWith')} />
      <SocialLogins />

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>{t('auth.haveAccount')} </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} hitSlop={8}>
          <Text style={styles.loginText}>{t('auth.logIn')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const makeStyles = (primary: string, textSecondary: string) => StyleSheet.create({
  formContainer: {
    gap: hScale(4),
  },
  lastInput: {
    marginBottom: hScale(4),
  },
  registerButton: {
    marginTop: hScale(12),
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: hScale(8),
  },
  footerText: {
    fontSize: wScale(14),
    color: textSecondary,
    fontFamily: Fonts.plusJakartaSansRegular,
  },
  loginText: {
    fontSize: wScale(14),
    color: primary,
    fontFamily: Fonts.plusJakartaSansBold,
  },
});
