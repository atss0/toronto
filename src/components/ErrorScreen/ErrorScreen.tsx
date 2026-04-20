import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useTranslation } from 'react-i18next';
import { useColors } from '../../context/ThemeContext';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';
import Layout from '../../styles/Layout';

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
  icon?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message,
  onRetry,
  icon = 'ic:round-wifi-off',
}) => {
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Iconify icon={icon} size={wScale(52)} color={colors.textSecondary} />
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message ?? t('common.error')}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.screenPaddingH,
    gap: hScale(16),
  },
  message: {
    fontSize: wScale(15),
    fontFamily: Fonts.plusJakartaSansRegular,
    textAlign: 'center',
    lineHeight: hScale(22),
  },
  button: {
    marginTop: hScale(8),
    paddingHorizontal: wScale(28),
    paddingVertical: hScale(12),
    borderRadius: Layout.borderRadius.md,
  },
  buttonText: {
    fontSize: wScale(14),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: '#FFFFFF',
  },
});
