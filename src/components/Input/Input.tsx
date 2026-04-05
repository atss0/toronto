import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import styles from './Input.style';
import Colors from '../../styles/Colors'; // Kendi dosya yoluna göre düzenle
import { Iconify } from 'react-native-iconify'; // İkon kütüphanesi (örneğin)

// --- TİPLER VE ARAYÜZLER (TYPESCRIPT) ---
export interface InputProps extends TextInputProps {
  /** Input'un üstünde görünecek başlık */
  label?: string;
  /** Hata mesajı. Varsa input kırmızı olur ve mesaj altta görünür. */
  error?: string;
  /** Sol tarafa eklenecek ikon (React Node) */
  leftIcon?: React.ReactNode;
  /** Sağ tarafa eklenecek ikon (React Node) */
  rightIcon?: React.ReactNode;
  /** Şifre inputu mu? (Göz ikonu ve sansürleme ekler) */
  isPassword?: boolean;
  /** Dış kapsayıcıya (wrapper) verilecek ekstra stiller */
  containerStyle?: ViewStyle;
}

// --- ANA BİLEŞEN ---
// forwardRef kullanarak dışarıdan focus() tetiklenmesine izin veriyoruz
const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      isPassword = false,
      containerStyle,
      style,
      onFocus,
      onBlur,
      editable = true,
      ...restProps
    },
    ref
  ) => {
    // Odak (Focus) ve Şifre Gizleme durumları (States)
    const [isFocused, setIsFocused] = useState(false);
    const [isSecureTextVisible, setIsSecureTextVisible] = useState(!isPassword);

    // Focus olduğunda çalışacak fonksiyon
    const handleFocus = (e: any) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    // Focus kaybolduğunda çalışacak fonksiyon
    const handleBlur = (e: any) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    // Dinamik Stiller
    const isError = !!error;
    const inputWrapperStyle = [
      styles.inputWrapper,
      isFocused && styles.inputWrapperFocused,
      isError && styles.inputWrapperError,
      !editable && styles.inputWrapperDisabled,
    ];

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Etiket (Label) */}
        {label && (
          <Text style={[styles.label, isError && styles.labelError]}>
            {label}
          </Text>
        )}

        {/* Input Kapsayıcısı */}
        <View style={inputWrapperStyle}>
          {/* Sol İkon */}
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          {/* Gerçek TextInput */}
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={Colors.textSecondary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={editable}
            secureTextEntry={isPassword && !isSecureTextVisible}
            {...restProps}
          />

          {/* Sağ İkon VEYA Şifre Göster/Gizle Butonu */}
          {isPassword ? (
            <Pressable
              onPress={() => setIsSecureTextVisible(!isSecureTextVisible)}
              style={styles.rightIcon}
              hitSlop={10} // Tıklanma alanını genişletir
            >
              {/* Buraya kendi projenizdeki göz ikonunu (Eye/EyeOff) koyabilirsiniz. Şimdilik emoji koydum. */}
              <Text style={{ fontSize: 16 }}>
                {isSecureTextVisible ? <Iconify icon='mdi:eye-outline' color={Colors.textSecondary} /> : <Iconify icon='mdi:eye-off-outline' color={Colors.textSecondary} />}
              </Text>
            </Pressable>
          ) : (
            rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>
          )}
        </View>

        {/* Hata Mesajı */}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

export default Input;