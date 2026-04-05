import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import Colors from '../../styles/Colors';
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

const DEFAULT_ACTIONS: QuickActionItem[] = [
  {
    id: '1',
    label: 'Explore',
    icon: 'solar:compass-bold',
    iconColor: Colors.primary,
    bgColor: Colors.primaryLight,
  },
  {
    id: '2',
    label: 'Save',
    icon: 'solar:bookmark-bold',
    iconColor: Colors.warning,
    bgColor: Colors.warningLight,
  },
  {
    id: '3',
    label: 'Events',
    icon: 'solar:calendar-mark-bold',
    iconColor: Colors.success,
    bgColor: Colors.successLight,
  },
  {
    id: '4',
    label: 'Nearby',
    icon: 'solar:map-point-wave-bold',
    iconColor: Colors.danger,
    bgColor: Colors.dangerLight,
  },
];

const QuickActions: React.FC<QuickActionsProps> = ({ actions = DEFAULT_ACTIONS }) => {
  return (
    <View style={styles.row}>
      {actions.map(action => (
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

const styles = StyleSheet.create({
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
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
