import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Iconify } from 'react-native-iconify';

import { useColors } from '../../context/ThemeContext';
import { AppColors } from '../../styles/theme';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';

type TabName = 'Home' | 'Explore' | 'Belen' | 'Routes' | 'Profile';

interface TabConfig {
  icon: string;
  activeIcon: string;
  labelKey: string;
  special?: boolean;
}

const TAB_CONFIG: Record<TabName, TabConfig> = {
  Home: {
    icon: 'solar:home-2-linear',
    activeIcon: 'solar:home-2-bold',
    labelKey: 'tabs.home',
  },
  Explore: {
    icon: 'solar:compass-linear',
    activeIcon: 'solar:compass-bold',
    labelKey: 'tabs.explore',
  },
  Belen: {
    icon: 'solar:map-point-wave-linear',
    activeIcon: 'solar:map-point-wave-bold',
    labelKey: 'tabs.belen',
    special: true,
  },
  Routes: {
    icon: 'solar:route-linear',
    activeIcon: 'solar:route-bold',
    labelKey: 'tabs.routes',
  },
  Profile: {
    icon: 'solar:user-circle-linear',
    activeIcon: 'solar:user-circle-bold',
    labelKey: 'tabs.profile',
  },
};

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.wrapper}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name as TabName];

        if (!config) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (config.special) {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.specialTabWrapper}
              onPress={onPress}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              <View style={[styles.specialButton, isFocused && styles.specialButtonActive]}>
                <Iconify
                  icon={isFocused ? config.activeIcon : config.icon}
                  size={wScale(26)}
                  color='#FFFFFF'
                />
              </View>
            </TouchableOpacity>
          );
        }

        const iconColor = isFocused ? colors.primary : colors.textSecondary;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <View style={styles.iconWrapper}>
              <Iconify
                icon={isFocused ? config.activeIcon : config.icon}
                size={wScale(24)}
                color={iconColor}
              />
              {isFocused && <View style={styles.activeDot} />}
            </View>
            <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
              {t(config.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingTop: hScale(10),
    paddingBottom: hScale(8),
    paddingHorizontal: wScale(8),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
    borderTopWidth: Platform.OS === 'android' ? 0 : 0.5,
    borderTopColor: colors.stroke,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: hScale(4),
    gap: hScale(3),
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: wScale(28),
  },
  activeDot: {
    position: 'absolute',
    bottom: -hScale(4),
    width: wScale(4),
    height: wScale(4),
    borderRadius: wScale(2),
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: wScale(10),
    fontFamily: Fonts.plusJakartaSansMedium,
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.primary,
    fontFamily: Fonts.plusJakartaSansSemiBold,
  },
  specialTabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: hScale(4),
  },
  specialButton: {
    width: wScale(50),
    height: wScale(50),
    borderRadius: wScale(25),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  specialButtonActive: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
  },
});
