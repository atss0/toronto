import React, { useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { Iconify } from 'react-native-iconify';

import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';
import ScreenWrapper from '../../components/ScreenWrapper';
import Button from '../../components/Button';
import { useColors } from '../../context/ThemeContext';
import authService from '../../services/auth';
import { tokenStorage } from '../../storage/tokenStorage';
import { setUser } from '../../redux/UserSlice';
import { RootStackParamList } from '../../types/navigation';

type RouteT = RouteProp<RootStackParamList, 'EmailVerification'>;
type NavProp = NativeStackNavigationProp<RootStackParamList, 'EmailVerification'>;

export default function EmailVerificationScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteT>();
  const colors = useColors();
  const dispatch = useDispatch();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const updateCode = (val: string, idx: number) => {
    const next = [...code];
    next[idx] = val.slice(-1);
    setCode(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const isComplete = code.every(c => c !== '');

  const handleVerify = async () => {
    if (!isComplete) return;
    setIsLoading(true);
    try {
      const response = await authService.verifyEmail(route.params.email, code.join(''));
      const { user, accessToken, refreshToken } = response.data.data;
      const rt = refreshToken ?? tokenStorage.getRefreshToken() ?? '';
      await tokenStorage.save(accessToken, rt);
      dispatch(setUser({ user, token: accessToken, refreshToken: rt || null }));
      // App.tsx navigates to Main automatically when token is set
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error?.message ?? 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authService.resendCode(route.params.email);
      Alert.alert('Sent', 'A new code has been sent to your email.');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error?.message ?? 'Could not resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ScreenWrapper>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={10}
      >
        <Iconify icon="solar:arrow-left-linear" size={wScale(20)} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.iconArea}>
        <View style={[styles.iconOuterCircle, { backgroundColor: `${colors.primary}1A` }]}>
          <View style={[styles.iconInnerCircle, { backgroundColor: `${colors.primary}33` }]}>
            <Iconify icon="solar:letter-opened-bold" size={wScale(36)} color={colors.primary} />
          </View>
        </View>
      </View>

      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We've sent a 6-digit code to{'\n'}
        <Text style={{ color: colors.primary, fontFamily: Fonts.plusJakartaSansSemiBold }}>
          {route.params.email}
        </Text>
      </Text>

      <View style={styles.codeRow}>
        {code.map((digit, i) => (
          <TextInput
            key={i}
            ref={ref => { inputs.current[i] = ref; }}
            style={[styles.codeInput, digit && styles.codeInputFilled]}
            value={digit}
            onChangeText={val => updateCode(val, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectionColor={colors.primary}
          />
        ))}
      </View>

      <Button
        title="Verify Email"
        onPress={handleVerify}
        size="large"
        style={styles.button}
        isLoading={isLoading}
        isDisabled={!isComplete}
        rightIcon={<Iconify icon="solar:arrow-right-linear" size={wScale(18)} color={colors.white} />}
      />

      <TouchableOpacity style={styles.resendRow} onPress={handleResend} disabled={isResending} hitSlop={8}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <Text style={[styles.resendText, { color: colors.primary, fontFamily: Fonts.plusJakartaSansSemiBold }]}>
          {isResending ? 'Sending...' : 'Resend'}
        </Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  backButton: {
    width: wScale(44), height: wScale(44), borderRadius: wScale(12),
    borderWidth: 1.5, borderColor: colors.stroke, borderStyle: 'dashed',
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start', marginBottom: hScale(48),
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  iconArea: { alignItems: 'center', marginBottom: hScale(32) },
  iconOuterCircle: { width: wScale(110), height: wScale(110), borderRadius: wScale(55), alignItems: 'center', justifyContent: 'center' },
  iconInnerCircle: { width: wScale(72), height: wScale(72), borderRadius: wScale(36), alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: wScale(26), fontFamily: Fonts.plusJakartaSansExtraBold,
    color: colors.textPrimary, textAlign: 'center', marginBottom: hScale(12),
  },
  subtitle: {
    fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary, textAlign: 'center', lineHeight: hScale(22),
    paddingHorizontal: wScale(8), marginBottom: hScale(36),
  },
  codeRow: { flexDirection: 'row', justifyContent: 'center', gap: wScale(10), marginBottom: hScale(28) },
  codeInput: {
    width: wScale(44), height: wScale(52), borderRadius: wScale(12),
    borderWidth: 1.5, borderColor: colors.stroke, backgroundColor: colors.white,
    fontSize: wScale(20), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary,
  },
  codeInputFilled: { borderColor: colors.primary, backgroundColor: `${colors.primary}10` },
  button: { marginBottom: hScale(20) },
  resendRow: { flexDirection: 'row', justifyContent: 'center' },
  resendText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
