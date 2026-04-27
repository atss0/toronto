import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { launchImageLibrary } from 'react-native-image-picker';

import StackHeader from '../components/StackHeader/StackHeader';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';
import { setUser } from '../redux/UserSlice';
import userService from '../services/user';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const user = useSelector((s: RootState) => s.User.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);

  const [name, setName] = useState(user?.name ?? '');
  const [surname, setSurname] = useState(user?.surname ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const initials = name
    ? `${name[0]}${surname?.[0] ?? ''}`.toUpperCase()
    : 'U';

  const handlePickPhoto = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
      async response => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (!asset?.uri) return;

        const uri = asset.uri;
        const type = asset.type ?? 'image/jpeg';
        const fileName = asset.fileName ?? `photo_${Date.now()}.jpg`;

        setLocalPhotoUri(uri);
        setIsUploadingPhoto(true);
        try {
          const res = await userService.uploadPhoto(uri, type, fileName);
          const photoUrl: string = res.data.data.photo_url;
          dispatch(setUser({ user: { ...user, photo: photoUrl } }));
        } catch {
          setLocalPhotoUri(null);
          Alert.alert(t('editProfile.photoError', 'Error'), t('editProfile.photoErrorMsg', 'Photo could not be uploaded. Please try again.'));
        } finally {
          setIsUploadingPhoto(false);
        }
      },
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await userService.updateMe({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
      });
      const updated = res.data.data.user;
      dispatch(setUser({ user: { ...user, ...updated } }));
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error?.message ?? 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StackHeader
        title={t('editProfile.title')}
        rightComponent={
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            accessibilityLabel={t('editProfile.save')}
            accessibilityRole="button"
          >
            <Text style={styles.saveText}>{t('common.save')}</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrap} onPress={handlePickPhoto} activeOpacity={0.85} disabled={isUploadingPhoto}>
            {localPhotoUri || user?.photo ? (
              <Image
                source={{ uri: localPhotoUri ?? user!.photo }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
            <View style={styles.cameraBtn}>
              {isUploadingPhoto ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Iconify icon="solar:camera-bold" size={wScale(13)} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>{t('editProfile.changePhoto', 'Change Photo')}</Text>
        </View>

        {/* Fields */}
        <View style={styles.fields}>
          {[
            { label: 'First Name', value: name, setter: setName, placeholder: 'John', icon: 'solar:user-linear' },
            { label: 'Last Name', value: surname, setter: setSurname, placeholder: 'Doe', icon: 'solar:user-linear' },
            { label: 'Email Address', value: email, setter: setEmail, placeholder: 'john@example.com', icon: 'solar:letter-linear' },
          ].map(field => (
            <View key={field.label} style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <View style={styles.inputWrap}>
                <Iconify icon={field.icon} size={wScale(16)} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize={field.label.includes('Email') ? 'none' : 'words'}
                  keyboardType={field.label.includes('Email') ? 'email-address' : 'default'}
                />
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={isLoading}
          accessibilityLabel={t('editProfile.save')}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveBtnText}>{t('editProfile.save')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },

    saveText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary },

    scroll: { paddingBottom: hScale(40) },

    avatarSection: { alignItems: 'center', paddingVertical: hScale(28) },
    avatarWrap: { position: 'relative', marginBottom: hScale(12) },
    avatarCircle: {
      width: wScale(90),
      height: wScale(90),
      borderRadius: wScale(45),
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.primary,
    },
    avatarImage: {
      width: wScale(90),
      height: wScale(90),
      borderRadius: wScale(45),
      borderWidth: 3,
      borderColor: colors.primary,
    },
    avatarInitials: { fontSize: wScale(30), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.primary },
    cameraBtn: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: wScale(28),
      height: wScale(28),
      borderRadius: wScale(14),
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.white,
    },
    changePhotoText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },

    fields: { paddingHorizontal: Layout.screenPaddingH, gap: hScale(16) },
    fieldGroup: { gap: hScale(6) },
    fieldLabel: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansBold, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(10),
      backgroundColor: colors.white,
      borderRadius: wScale(14),
      borderWidth: 1,
      borderColor: colors.stroke,
      paddingHorizontal: wScale(14),
      paddingVertical: hScale(13),
    },
    input: {
      flex: 1,
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textPrimary,
      padding: 0,
    },

    saveBtn: {
      marginHorizontal: Layout.screenPaddingH,
      marginTop: hScale(32),
      backgroundColor: colors.primary,
      borderRadius: wScale(16),
      paddingVertical: hScale(15),
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    saveBtnText: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF' },
  });
