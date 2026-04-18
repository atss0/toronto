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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import StackHeader from '../components/StackHeader/StackHeader';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';
import { setUser } from '../redux/UserSlice';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const user = useSelector((s: RootState) => s.User.user);
  const token = useSelector((s: RootState) => s.User.token);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(user?.name ?? '');
  const [surname, setSurname] = useState(user?.surname ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const initials = name
    ? `${name[0]}${surname?.[0] ?? ''}`.toUpperCase()
    : 'U';

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      dispatch(setUser({
        user: { ...user, name: name.trim(), surname: surname.trim(), email: email.trim() },
        token,
      }));
      setIsLoading(false);
      navigation.goBack();
    }, 800);
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
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <TouchableOpacity style={styles.cameraBtn}>
              <Iconify icon="solar:camera-bold" size={wScale(13)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Change Photo</Text>
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
