import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

interface Stop { id: string; name: string }

const CreateRouteScreen = () => {
  const navigation = useNavigation();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [routeName, setRouteName] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [stops, setStops] = useState<Stop[]>([{ id: '1', name: '' }]);
  const [selectedDuration, setSelectedDuration] = useState('half-day');

  const addStop = () => setStops(prev => [...prev, { id: String(Date.now()), name: '' }]);
  const removeStop = (id: string) => setStops(prev => prev.filter(s => s.id !== id));
  const updateStop = (id: string, name: string) =>
    setStops(prev => prev.map(s => s.id === id ? { ...s, name } : s));

  const handleCreate = () => {
    if (!routeName.trim()) {
      Alert.alert('Validation', 'Please enter a route name.');
      return;
    }
    if (!startPoint.trim()) {
      Alert.alert('Validation', 'Please enter a starting point.');
      return;
    }
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:close-circle-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Route</Text>
        <TouchableOpacity onPress={handleCreate}>
          <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Route Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ROUTE NAME</Text>
          <View style={styles.inputWrap}>
            <Iconify icon="solar:route-linear" size={wScale(16)} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Morning in Sultanahmet"
              placeholderTextColor={colors.textSecondary}
              value={routeName}
              onChangeText={setRouteName}
            />
          </View>
        </View>

        {/* Starting Point */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>STARTING POINT</Text>
          <View style={styles.inputWrap}>
            <Iconify icon="solar:map-point-linear" size={wScale(16)} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Enter starting location"
              placeholderTextColor={colors.textSecondary}
              value={startPoint}
              onChangeText={setStartPoint}
            />
          </View>
        </View>

        {/* Duration */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DURATION</Text>
          <View style={styles.durationRow}>
            {[
              { id: 'quick', label: '1–2 h' },
              { id: 'half-day', label: 'Half Day' },
              { id: 'full-day', label: 'Full Day' },
            ].map(d => (
              <TouchableOpacity
                key={d.id}
                style={[styles.durationChip, d.id === selectedDuration && styles.durationChipActive]}
                onPress={() => setSelectedDuration(d.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.durationLabel, d.id === selectedDuration && styles.durationLabelActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stops */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>STOPS</Text>
          {stops.map((stop, i) => (
            <View key={stop.id} style={styles.stopRow}>
              <View style={styles.stopDotCol}>
                <View style={[styles.stopDot, i === 0 && styles.stopDotFirst, i === stops.length - 1 && styles.stopDotLast]} />
                {i < stops.length - 1 && <View style={styles.stopLine} />}
              </View>
              <View style={styles.stopInputWrap}>
                <TextInput
                  style={styles.stopInput}
                  placeholder={`Stop ${i + 1}`}
                  placeholderTextColor={colors.textSecondary}
                  value={stop.name}
                  onChangeText={v => updateStop(stop.id, v)}
                />
                {stops.length > 1 && (
                  <TouchableOpacity onPress={() => removeStop(stop.id)} hitSlop={8}>
                    <Iconify icon="solar:close-circle-linear" size={wScale(18)} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addStopBtn} onPress={addStop} activeOpacity={0.8}>
            <Iconify icon="solar:add-circle-linear" size={wScale(18)} color={colors.primary} />
            <Text style={styles.addStopText}>Add Stop</Text>
          </TouchableOpacity>
        </View>

        {/* Map Placeholder */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>MAP PREVIEW</Text>
          <View style={styles.mapPlaceholder}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.mapBackground, borderRadius: wScale(14) }]} />
            <Iconify icon="solar:map-bold" size={wScale(40)} color={colors.primary} />
            <Text style={styles.mapHint}>Map preview will appear after adding stops</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateRouteScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  createText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary },
  scroll: { padding: Layout.screenPaddingH, gap: hScale(20), paddingBottom: hScale(40) },
  fieldGroup: { gap: hScale(8) },
  fieldLabel: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansBold, color: colors.textSecondary, letterSpacing: 1 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(10),
    backgroundColor: colors.white, borderRadius: wScale(14), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(13),
  },
  input: { flex: 1, fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary, padding: 0 },
  durationRow: { flexDirection: 'row', gap: wScale(10) },
  durationChip: {
    flex: 1, alignItems: 'center', paddingVertical: hScale(10),
    backgroundColor: colors.white, borderRadius: wScale(12), borderWidth: 1, borderColor: colors.stroke,
  },
  durationChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  durationLabel: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary },
  durationLabelActive: { color: '#FFFFFF' },
  stopRow: { flexDirection: 'row', gap: wScale(12), alignItems: 'flex-start' },
  stopDotCol: { alignItems: 'center', width: wScale(20), paddingTop: hScale(14) },
  stopDot: { width: wScale(10), height: wScale(10), borderRadius: wScale(5), backgroundColor: colors.textSecondary, borderWidth: 2, borderColor: colors.textSecondary },
  stopDotFirst: { backgroundColor: colors.primary, borderColor: colors.primary },
  stopDotLast: { backgroundColor: colors.danger, borderColor: colors.danger },
  stopLine: { width: 2, flex: 1, minHeight: hScale(16), backgroundColor: colors.stroke, marginTop: hScale(4) },
  stopInputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: wScale(8),
    backgroundColor: colors.white, borderRadius: wScale(12), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(12), marginBottom: hScale(8),
  },
  stopInput: { flex: 1, fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary, padding: 0 },
  addStopBtn: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(6),
    marginLeft: wScale(32), paddingVertical: hScale(8),
  },
  addStopText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },
  mapPlaceholder: {
    height: hScale(160), borderRadius: wScale(14), borderWidth: 1, borderColor: colors.stroke,
    alignItems: 'center', justifyContent: 'center', gap: hScale(8),
  },
  mapHint: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: wScale(20) },
});
