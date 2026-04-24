import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useDispatch, useSelector } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';
import { setPreferences } from '../redux/UserSlice';
import userService from '../services/user';

const OPTIONS = [
  { id: 'solo', label: 'Solo', desc: 'Travelling alone, self-paced adventures', icon: 'solar:user-bold', color: '#3182ED', bg: '#EBF3FE' },
  { id: 'couple', label: 'Couple', desc: 'Romantic getaways for two', icon: 'solar:users-group-two-rounded-bold', color: '#EF4444', bg: '#FFE4E6' },
  { id: 'family', label: 'Family', desc: 'Family-friendly trips with kids', icon: 'solar:home-smile-bold', color: '#10B981', bg: '#D1FAE5' },
  { id: 'group', label: 'Group', desc: 'Adventures with friends or colleagues', icon: 'solar:users-group-rounded-bold', color: '#F59E0B', bg: '#FEF3C7' },
];

const TravelStyleScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const user = useSelector((s: RootState) => s.User.user);
  const dispatch = useDispatch();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [selected, setSelected] = useState(user?.travel_style ?? 'solo');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await userService.updatePreferences({ travel_style: selected });
      dispatch(setPreferences({ travel_style: selected }));
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error?.message ?? 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Travel Style</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          {isLoading
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Text style={styles.saveText}>Save</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>How do you prefer to travel?</Text>
        {OPTIONS.map(opt => {
          const isSelected = selected === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.card, isSelected && { borderColor: opt.color, borderWidth: 2 }]}
              onPress={() => setSelected(opt.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, { backgroundColor: opt.bg }]}>
                <Iconify icon={opt.icon} size={wScale(24)} color={opt.color} />
              </View>
              <View style={styles.info}>
                <Text style={[styles.label, isSelected && { color: opt.color }]}>{opt.label}</Text>
                <Text style={styles.desc}>{opt.desc}</Text>
              </View>
              {isSelected && <Iconify icon="solar:check-circle-bold" size={wScale(22)} color={opt.color} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TravelStyleScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  saveText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary },
  scroll: { padding: Layout.screenPaddingH, gap: hScale(12), paddingBottom: hScale(40) },
  subtitle: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginBottom: hScale(4), lineHeight: hScale(21) },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(14),
    backgroundColor: colors.white, borderRadius: wScale(16), borderWidth: 1, borderColor: colors.stroke, padding: wScale(16),
  },
  iconWrap: { width: wScale(52), height: wScale(52), borderRadius: wScale(16), alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  label: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, marginBottom: hScale(3) },
  desc: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
