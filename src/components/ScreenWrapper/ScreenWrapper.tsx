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
import Colors from '../../styles/Colors';
import Layout from '../../styles/Layout';

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** true geçilirse ScrollView içine alır, varsayılan false */
  scrollable?: boolean;
  /** Klavye açıldığında içeriği yukarı kaydırır, varsayılan true */
  keyboardAvoiding?: boolean;
  backgroundColor?: string;
  /** Ek stil — paddingHorizontal override edilebilir */
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  statusBarStyle?: 'dark-content' | 'light-content';
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = false,
  keyboardAvoiding = true,
  backgroundColor = Colors.inputBackground,
  style,
  contentContainerStyle,
  statusBarStyle = 'dark-content',
}) => {
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
    <View style={[styles.root, { backgroundColor }]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
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
