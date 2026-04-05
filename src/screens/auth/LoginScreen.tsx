import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { wScale, hScale } from '../../styles/Scaler';
import ScreenWrapper from '../../components/ScreenWrapper';
import AuthHeader from '../../components/AuthHeader';
import AuthDivider from '../../components/AuthDivider';
import SocialLogins from '../../components/SocialLogins';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleLogin = () => {
    console.log('Giriş yapılıyor...', { email, password });
  };

  return (
    <ScreenWrapper scrollable>
      <AuthHeader
        title={t('auth.welcomeBack')}
        subtitle={t('auth.loginSubtitle')}
      />

      <View style={styles.formContainer}>
        <Input
          label={t('auth.emailLabel')}
          placeholder={t('auth.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Şifre + Şifremi Unuttum satırı */}
        <View>
          <Input
            label={t('auth.passwordLabel')}
            placeholder={t('auth.passwordPlaceholder')}
            isPassword
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.passwordInput}
          />
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate('ForgotPassword')}
            hitSlop={8}
          >
            <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>
        </View>

        <Button
          title={t('auth.loginButton')}
          onPress={handleLogin}
          size="large"
          style={styles.loginButton}
        />
      </View>

      <AuthDivider text={t('auth.orContinueWith')} />
      <SocialLogins />

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>{t('auth.noAccount')} </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} hitSlop={8}>
          <Text style={styles.signUpText}>{t('auth.signUp')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: hScale(4),
  },
  passwordInput: {
    marginBottom: hScale(6),
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: hScale(20),
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
  },
  loginButton: {
    marginTop: hScale(4),
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
    color: Colors.textSecondary,
    fontFamily: Fonts.plusJakartaSansRegular,
  },
  signUpText: {
    fontSize: wScale(14),
    color: Colors.primary,
    fontFamily: Fonts.plusJakartaSansBold,
  },
});
