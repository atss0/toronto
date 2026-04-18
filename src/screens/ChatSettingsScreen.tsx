import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

const ChatSettingsScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [saveHistory, setSaveHistory] = useState(true);
  const [voiceInput, setVoiceInput] = useState(false);
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [personalizeAI, setPersonalizeAI] = useState(true);

  const clearHistory = () =>
    Alert.alert('Clear History', 'Delete all conversation history with Belen?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {} },
    ]);

  const settings = [
    { label: 'Save Conversation History', desc: 'Keep chat history for better AI context', value: saveHistory, setter: setSaveHistory },
    { label: 'Voice Input', desc: 'Use microphone to send voice messages', value: voiceInput, setter: setVoiceInput },
    { label: 'Auto-suggest Places', desc: 'Show quick suggestion chips during chat', value: autoSuggest, setter: setAutoSuggest },
    { label: 'Personalize AI Responses', desc: 'Use your travel preferences to refine answers', value: personalizeAI, setter: setPersonalizeAI },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assistant Settings</Text>
        <View style={{ width: wScale(36) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {settings.map((s, i) => (
            <View key={s.label} style={[styles.row, i < settings.length - 1 && styles.rowBorder]}>
              <View style={styles.info}>
                <Text style={styles.label}>{s.label}</Text>
                <Text style={styles.desc}>{s.desc}</Text>
              </View>
              <Switch
                value={s.value}
                onValueChange={s.setter}
                trackColor={{ false: colors.stroke, true: colors.primaryLight }}
                thumbColor={s.value ? colors.primary : colors.textSecondary}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.dangerBtn} onPress={clearHistory} activeOpacity={0.8}>
          <Iconify icon="solar:trash-bin-trash-bold" size={wScale(18)} color={colors.danger} />
          <Text style={styles.dangerText}>Clear Conversation History</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ChatSettingsScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  scroll: { padding: Layout.screenPaddingH, gap: hScale(16), paddingBottom: hScale(40) },
  card: { backgroundColor: colors.white, borderRadius: wScale(18), borderWidth: 1, borderColor: colors.stroke, paddingHorizontal: wScale(16) },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: hScale(14), gap: wScale(12) },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.stroke },
  info: { flex: 1 },
  label: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textPrimary, marginBottom: hScale(2) },
  desc: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wScale(8),
    backgroundColor: colors.dangerLight, borderRadius: wScale(16), paddingVertical: hScale(14),
    borderWidth: 1, borderColor: `${colors.danger}30`,
  },
  dangerText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.danger },
});
