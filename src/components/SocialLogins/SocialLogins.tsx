import React from 'react';
import { View, Platform } from 'react-native';
import { Iconify } from 'react-native-iconify';
import Button from '../Button'; // Kendi Button component'in
import Colors from '../../styles/Colors'; // Yolunu ayarla
import styles from './SocialLogins.style'
import { useTranslation } from 'react-i18next';

const SocialLogins = () => {
  const { t } = useTranslation();
  // Cihazın iOS olup olmadığını kontrol ediyoruz
  const isIOS = Platform.OS === 'ios';

  return (
    <View style={styles.container}>
      <Button
        title={t('auth.google')}
        variant="outline"
        leftIcon={<Iconify icon="logos:google-icon" size={18} />}
        style={styles.socialButton}
        onPress={() => console.log('Google tıklandı')}
      />

      {isIOS && (
        <Button
          title={t('auth.apple')}
          variant="outline"
          leftIcon={<Iconify icon="ic:baseline-apple" size={20} color={Colors.textPrimary} />}
          style={styles.socialButton}
          onPress={() => console.log('Apple tıklandı')}
        />
      )}
    </View>
  );
};

export default SocialLogins;