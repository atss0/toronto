import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useColors } from '../../context/ThemeContext';
import Layout from '../../styles/Layout';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  statusBarStyle?: 'dark-content' | 'light-content';
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = false,
  keyboardAvoiding = true,
  backgroundColor,
  style,
  contentContainerStyle,
  statusBarStyle,
}) => {
  const colors = useColors();
  const bg = backgroundColor ?? colors.inputBackground;
  const barStyle = statusBarStyle ?? (colors.background === '#0F172A' ? 'light-content' : 'dark-content');

  const inner = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.contentContainer, style]}>
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={bg}
        translucent={false}
      />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {inner}
        </KeyboardAvoidingView>
      ) : (
        inner
      )}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Layout.screenPaddingTop,
    paddingBottom: Layout.screenPaddingBottom,
  },
});
