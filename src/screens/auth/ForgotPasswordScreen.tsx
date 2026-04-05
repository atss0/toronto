import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Iconify } from 'react-native-iconify';

import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const { t } = useTranslation();

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
          color={Colors.textPrimary}
        />
      </TouchableOpacity>

      {/* İkon Alanı */}
      <View style={styles.iconArea}>
        <View style={styles.iconOuterCircle}>
          <View style={styles.iconInnerCircle}>
            <Iconify
              icon="mdi:lock-reset"
              size={wScale(36)}
              color={Colors.primary}
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
              color={Colors.textSecondary}
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
              color={Colors.white}
            />
          }
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: wScale(44),
    height: wScale(44),
    borderRadius: wScale(12),
    borderWidth: 1.5,
    borderColor: Colors.stroke,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: hScale(48),
    shadowColor: Colors.black,
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
    backgroundColor: `${Colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInnerCircle: {
    width: wScale(72),
    height: wScale(72),
    borderRadius: wScale(36),
    backgroundColor: `${Colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: wScale(26),
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: hScale(12),
  },
  subtitle: {
    fontSize: wScale(14),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textSecondary,
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
