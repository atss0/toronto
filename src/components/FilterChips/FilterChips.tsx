import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';

export interface FilterItem {
  id: string;
  label: string;
  icon?: string;
}

interface FilterChipsProps {
  items: FilterItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ items, activeId, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    >
      {items.map(item => {
        const isActive = item.id === activeId;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.75}
          >
            {item.icon && (
              <Iconify
                icon={item.icon}
                size={wScale(14)}
                color={isActive ? Colors.white : Colors.textSecondary}
              />
            )}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default FilterChips;

const styles = StyleSheet.create({
  list: {
    gap: wScale(8),
    paddingVertical: hScale(2),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(5),
    paddingHorizontal: wScale(14),
    paddingVertical: hScale(9),
    borderRadius: wScale(24),
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.stroke,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.white,
  },
});
