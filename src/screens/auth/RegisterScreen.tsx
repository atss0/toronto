import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import authService from '../../services/auth';
import { tokenStorage } from '../../storage/tokenStorage';
import { RootStackParamList } from '../../types/navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<NavProp>();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors.primary, colors.textSecondary, colors.danger), [colors]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const response = await authService.register({
        name: firstName,
        surname: lastName,
        username,
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data.data;
      await tokenStorage.save(accessToken, refreshToken);
      navigation.navigate('EmailVerification', { email });
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? t('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = firstName && lastName && username && email && password && confirmPassword;

  return (
    <ScreenWrapper scrollable>
      <AuthHeader
        title={t('auth.registerTitle')}
        subtitle={t('auth.registerSubtitle')}
      />

      <View style={styles.formContainer}>
        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <Input
              label={t('auth.nameLabel')}
              placeholder={t('auth.namePlaceholder')}
              autoCapitalize="words"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.nameField}>
            <Input
              label={t('auth.surnameLabel')}
              placeholder={t('auth.surnamePlaceholder')}
              autoCapitalize="words"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>
        <Input
          label={t('auth.usernameLabel')}
          placeholder={t('auth.usernamePlaceholder')}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
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

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title={t('auth.registerButton')}
          onPress={handleRegister}
          size="large"
          style={styles.registerButton}
          isLoading={isLoading}
          isDisabled={!isFormValid}
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

const makeStyles = (primary: string, textSecondary: string, danger: string) => StyleSheet.create({
  formContainer: {
    gap: hScale(4),
  },
  nameRow: {
    flexDirection: 'row',
    gap: wScale(10),
  },
  nameField: {
    flex: 1,
  },
  lastInput: {
    marginBottom: hScale(4),
  },
  errorText: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: danger,
    textAlign: 'center',
    marginVertical: hScale(4),
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
