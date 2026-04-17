import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Iconify } from 'react-native-iconify';

import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useColors } from '../../context/ThemeContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleSendReset = () => {
    console.log('Reset link gönderiliyor...', { email });
  };

  return (
    <ScreenWrapper>
      {/* Geri Butonu */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={10}
      >
        <Iconify
          icon="solar:arrow-left-linear"
          size={wScale(20)}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      {/* İkon Alanı */}
      <View style={styles.iconArea}>
        <View style={[styles.iconOuterCircle, { backgroundColor: `${colors.primary}1A` }]}>
          <View style={[styles.iconInnerCircle, { backgroundColor: `${colors.primary}33` }]}>
            <Iconify
              icon="mdi:lock-reset"
              size={wScale(36)}
              color={colors.primary}
            />
          </View>
        </View>
      </View>

      {/* Başlık & Alt Başlık */}
      <Text style={styles.title}>{t('auth.forgotPasswordTitle')}</Text>
      <Text style={styles.subtitle}>{t('auth.forgotPasswordSubtitle')}</Text>

      {/* E-posta Input */}
      <View style={styles.formArea}>
        <Input
          label={t('auth.emailLabel')}
          placeholder={t('auth.emailPlaceholderFP')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          leftIcon={
            <Iconify
              icon="solar:letter-linear"
              size={wScale(18)}
              color={colors.textSecondary}
            />
          }
        />

        {/* Gönder Butonu */}
        <Button
          title={t('auth.sendResetLink')}
          onPress={handleSendReset}
          size="large"
          style={styles.button}
          rightIcon={
            <Iconify
              icon="solar:arrow-right-linear"
              size={wScale(18)}
              color={colors.white}
            />
          }
        />
      </View>
    </ScreenWrapper>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  backButton: {
    width: wScale(44),
    height: wScale(44),
    borderRadius: wScale(12),
    borderWidth: 1.5,
    borderColor: colors.stroke,
    borderStyle: 'dashed',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: hScale(48),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconArea: {
    alignItems: 'center',
    marginBottom: hScale(32),
  },
  iconOuterCircle: {
    width: wScale(110),
    height: wScale(110),
    borderRadius: wScale(55),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInnerCircle: {
    width: wScale(72),
    height: wScale(72),
    borderRadius: wScale(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: wScale(26),
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: hScale(12),
  },
  subtitle: {
    fontSize: wScale(14),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: hScale(22),
    paddingHorizontal: wScale(8),
    marginBottom: hScale(40),
  },
  formArea: {},
  button: {
    marginTop: hScale(4),
  },
});
