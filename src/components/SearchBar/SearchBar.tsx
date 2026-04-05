import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';

interface SearchBarProps extends TextInputProps {
  onFilterPress?: () => void;
  showFilter?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onFilterPress,
  showFilter = true,
  placeholder = 'Search places, restaurants...',
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconLeft}>
        <Iconify icon="solar:magnifer-linear" size={wScale(18)} color={Colors.textSecondary} />
      </View>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        {...rest}
      />

      {showFilter && (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress} hitSlop={8}>
          <Iconify icon="solar:filter-bold-duotone" size={wScale(18)} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wScale(14),
    borderWidth: 1.5,
    borderColor: Colors.stroke,
    paddingHorizontal: wScale(14),
    height: hScale(52),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconLeft: {
    marginRight: wScale(10),
  },
  input: {
    flex: 1,
    fontSize: wScale(14),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  filterBtn: {
    width: wScale(34),
    height: wScale(34),
    backgroundColor: Colors.primaryLight,
    borderRadius: wScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wScale(6),
  },
});
