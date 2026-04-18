import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Iconify } from 'react-native-iconify';

import { useColors } from '../../context/ThemeContext';
import { AppColors } from '../../styles/theme';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';
import Layout from '../../styles/Layout';
import { RootState } from '../../redux/store';

interface StackHeaderProps {
  title: string;
  rightIcon?: string;
  rightIconColor?: string;
  rightComponent?: React.ReactNode;
  onRightPress?: () => void;
  showStatusBar?: boolean;
}

const StackHeader: React.FC<StackHeaderProps> = ({
  title,
  rightIcon,
  rightIconColor,
  rightComponent,
  onRightPress,
  showStatusBar = true,
}) => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <>
      {showStatusBar && (
        <StatusBar
          barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.inputBackground}
        />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>

        {rightComponent ? (
          rightComponent
        ) : rightIcon && onRightPress ? (
          <TouchableOpacity
            style={styles.rightBtn}
            onPress={onRightPress}
            activeOpacity={0.7}
            accessibilityLabel={`${title} action`}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Iconify icon={rightIcon} size={wScale(20)} color={rightIconColor ?? colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </>
  );
};

export default StackHeader;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Layout.header.paddingTop,
    paddingBottom: Layout.header.paddingBottom,
    backgroundColor: colors.inputBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  backBtn: {
    width: Layout.hitArea.backButton,
    height: Layout.hitArea.backButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: wScale(17),
    fontFamily: Fonts.plusJakartaSansBold,
    color: colors.textPrimary,
    marginHorizontal: wScale(8),
  },
  rightBtn: {
    width: Layout.hitArea.backButton,
    height: Layout.hitArea.backButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: Layout.hitArea.backButton,
  },
});
