import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './AuthHeader.style'
import Colors from '../../styles/Colors';
import { Iconify } from 'react-native-iconify';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Logo ve App Name */}
      {/* <View style={styles.topSection}>
        <View style={styles.logoBox}>
          <Iconify icon="solar:compass-bold" size={28} color={Colors.white} />
        </View>
        <Text style={styles.appName}>{t('auth.appName')}</Text>
        <Text style={styles.appSlogan}>{t('auth.appSlogan')}</Text>
      </View> */}

      {/* Sayfa Başlığı (Welcome vb.) */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

export default AuthHeader;