import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Iconify } from 'react-native-iconify';

import { RootState } from '../../redux/store';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';
import Layout from '../../styles/Layout';

interface HeaderProps {
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

const getGreetingKey = (): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' => {
  const hour = new Date().getHours();
  if (hour < 12) return 'greetingMorning';
  if (hour < 18) return 'greetingAfternoon';
  return 'greetingEvening';
};

const Header: React.FC<HeaderProps> = ({ onNotificationPress, onAvatarPress }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.User.user);
  const locationName = useSelector((state: RootState) => state.User.locationName);

  const firstName = user?.name ?? 'Traveler';
  const city = locationName || 'İstanbul';
  const greetingKey = getGreetingKey();
  const initials = user?.name
    ? `${user.name[0]}${user.surname?.[0] ?? ''}`.toUpperCase()
    : 'T';

  return (
    <View style={styles.container}>
      {/* Üst satır: Konum + Aksiyonlar */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.locationChip} activeOpacity={0.75}>
          <Iconify icon="solar:map-point-bold" size={wScale(13)} color={Colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>{city}</Text>
          <Iconify icon="solar:alt-arrow-down-bold" size={wScale(11)} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress} hitSlop={8}>
            <Iconify icon="solar:bell-linear" size={wScale(20)} color={Colors.textPrimary} />
            <View style={styles.badge} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.avatar} onPress={onAvatarPress} hitSlop={8}>
            {user?.photo ? (
              <Image source={{ uri: user.photo }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Selamlama */}
      <View style={styles.greetingBlock}>
        <Text style={styles.greeting}>
          {t(`header.${greetingKey}`)},{'\n'}
          <Text style={styles.greetingName}>{firstName}</Text>
        </Text>
        <Text style={styles.subtitle}>{t('header.subtitle')}</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: hScale(12),
    paddingBottom: hScale(20),
    gap: hScale(16),
  },

  // Üst satır
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(4),
    backgroundColor: Colors.white,
    paddingHorizontal: wScale(12),
    paddingVertical: hScale(6),
    borderRadius: wScale(20),
    borderWidth: 1,
    borderColor: Colors.stroke,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    maxWidth: wScale(150),
  },
  locationText: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(10),
  },
  iconButton: {
    width: wScale(40),
    height: wScale(40),
    backgroundColor: Colors.white,
    borderRadius: wScale(12),
    borderWidth: 1,
    borderColor: Colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  badge: {
    position: 'absolute',
    top: hScale(8),
    right: wScale(9),
    width: wScale(7),
    height: wScale(7),
    borderRadius: wScale(4),
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.inputBackground,
  },
  avatar: {
    width: wScale(40),
    height: wScale(40),
    borderRadius: wScale(12),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansBold,
    color: Colors.primary,
  },

  // Selamlama
  greetingBlock: {
    gap: hScale(3),
  },
  greeting: {
    fontSize: wScale(28),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textPrimary,
    lineHeight: hScale(36),
    letterSpacing: -0.3,
  },
  greetingName: {
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textSecondary,
    marginTop: hScale(2),
  },
});
