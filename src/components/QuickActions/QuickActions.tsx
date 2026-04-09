import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useColors } from '../../context/ThemeContext';
import { AppColors } from '../../styles/theme';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';

export interface QuickActionItem {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  onPress?: () => void;
}

interface QuickActionsProps {
  actions?: QuickActionItem[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const defaultActions: QuickActionItem[] = useMemo(() => [
    {
      id: '1',
      label: 'Explore',
      icon: 'solar:compass-bold',
      iconColor: colors.primary,
      bgColor: colors.primaryLight,
    },
    {
      id: '2',
      label: 'Save',
      icon: 'solar:bookmark-bold',
      iconColor: colors.warning,
      bgColor: colors.warningLight,
    },
    {
      id: '3',
      label: 'Events',
      icon: 'solar:calendar-mark-bold',
      iconColor: colors.success,
      bgColor: colors.successLight,
    },
    {
      id: '4',
      label: 'Nearby',
      icon: 'solar:map-point-wave-bold',
      iconColor: colors.danger,
      bgColor: colors.dangerLight,
    },
  ], [colors]);

  const items = actions ?? defaultActions;

  return (
    <View style={styles.row}>
      {items.map(action => (
        <TouchableOpacity
          key={action.id}
          style={styles.item}
          onPress={action.onPress}
          activeOpacity={0.75}
        >
          <View style={[styles.iconBox, { backgroundColor: action.bgColor }]}>
            <Iconify icon={action.icon} size={wScale(24)} color={action.iconColor} />
          </View>
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default QuickActions;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wScale(10),
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: hScale(8),
  },
  iconBox: {
    width: wScale(56),
    height: wScale(56),
    borderRadius: wScale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: wScale(12),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
