import React, { useState } from 'react';
import { View, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { Iconify } from 'react-native-iconify';
import { GoogleSignin, statusCodes, isErrorWithCode } from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';

import Button from '../Button';
import Colors from '../../styles/Colors';
import styles from './SocialLogins.style';
import { useTranslation } from 'react-i18next';
import authService from '../../services/auth';
import { tokenStorage } from '../../storage/tokenStorage';
import { setUser } from '../../redux/UserSlice';
import storage from '../../storage';
import { RootStackParamList } from '../../types/navigation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const SocialLogins = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<NavProp>();
  const isIOS = Platform.OS === 'ios';

  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleSocialSuccess = async (
    user: any,
    accessToken: string,
    refreshToken: string,
    is_new_user: boolean,
  ) => {
    await tokenStorage.save(accessToken, refreshToken);

    if (is_new_user) {
      storage.set('pendingUser', JSON.stringify(user));
      navigation.navigate('Onboarding');
    } else {
      dispatch(setUser({ user, token: accessToken, refreshToken }));
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === 'cancelled') return;

      const idToken = response.data?.idToken;
      if (!idToken) throw new Error('Google Sign-In: no id_token returned.');

      const res = await authService.social('google', idToken);
      const { user, accessToken, refreshToken, is_new_user } = res.data.data;
      await handleSocialSuccess(user, accessToken, refreshToken, is_new_user);
    } catch (err: any) {
      if (isErrorWithCode(err)) {
        if (err.code === statusCodes.SIGN_IN_CANCELLED) return;
        if (err.code === statusCodes.IN_PROGRESS) return;
      }
      Alert.alert('Google Sign-In Error', err?.response?.data?.error?.message ?? err?.message ?? t('errors.generic'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleApple = async () => {
    setAppleLoading(true);
    try {
      const appleResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken } = appleResponse;
      if (!identityToken) throw new Error('Apple Sign-In: no identity token returned.');

      const res = await authService.social('apple', identityToken);
      const { user, accessToken, refreshToken, is_new_user } = res.data.data;
      await handleSocialSuccess(user, accessToken, refreshToken, is_new_user);
    } catch (err: any) {
      if (err?.code === appleAuth.Error.CANCELED) return;
      Alert.alert('Apple Sign-In Error', err?.response?.data?.error?.message ?? err?.message ?? t('errors.generic'));
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={t('auth.google')}
        variant="outline"
        leftIcon={<Iconify icon="logos:google-icon" size={18} />}
        style={styles.socialButton}
        onPress={handleGoogle}
        isLoading={googleLoading}
      />

      {isIOS && (
        <Button
          title={t('auth.apple')}
          variant="outline"
          leftIcon={<Iconify icon="ic:baseline-apple" size={20} color={Colors.textPrimary} />}
          style={styles.socialButton}
          onPress={handleApple}
          isLoading={appleLoading}
        />
      )}
    </View>
  );
};

export default SocialLogins;
