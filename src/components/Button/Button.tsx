import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PressableProps,
  View,
} from 'react-native';
import styles from './Button.style';
import Colors from '../../styles/Colors'; // Renk dosyanın yolunu buraya göre ayarla

// --- TİPLER VE ARAYÜZLER (TYPESCRIPT) ---
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

// --- ANA BİLEŞEN ---
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...restProps
}) => {
  const disabled = isDisabled || isLoading;

  const getContainerStyle = (pressed: boolean): ViewStyle[] => {
    return [
      styles.baseContainer,
      styles[`${size}Container`],
      styles[`${variant}Container`],
      ...(pressed && !disabled ? [styles[`${variant}Pressed`]] : []),
      ...(disabled ? [styles.disabledContainer] : []),
      ...(Array.isArray(style) ? style : [style]),
    ].filter(Boolean) as ViewStyle[];
  };

  const getTextStyle = (): TextStyle[] => {
    return [
      styles.baseText,
      styles[`${size}Text`],
      styles[`${variant}Text`],
      disabled && styles.disabledText,
      ...(Array.isArray(textStyle) ? textStyle : [textStyle]),
    ].filter(Boolean) as TextStyle[];
  };

  // Tema renklerine göre dinamik Spinner rengi
  const indicatorColor = variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white;
  
  // Tema renklerine göre dinamik Ripple (Dalgalanma) rengi
  // Saydam renkler objeden kaldırıldığı için rgba ile yeni renklere uyarlandı
  const rippleColor = variant === 'primary' || variant === 'danger' 
    ? 'rgba(255, 255, 255, 0.3)'   // Koyu butonlar için saydam beyaz
    : 'rgba(15, 23, 42, 0.1)';     // Açık butonlar için saydam koyu lacivert (Colors.black)

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => getContainerStyle(pressed)}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: isLoading }}
      android_ripple={{ color: rippleColor, borderless: false }}
      {...restProps}
    >
      <View style={styles.contentWrapper}>
        {isLoading ? (
          <ActivityIndicator color={indicatorColor} size="small" />
        ) : (
          <>
            {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
            <Text style={getTextStyle()}>{title}</Text>
            {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
          </>
        )}
      </View>
    </Pressable>
  );
};

export default Button;