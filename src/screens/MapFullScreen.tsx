import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types/navigation';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

type RouteT = RouteProp<RootStackParamList, 'MapFull'>;

const { width: W, height: H } = Dimensions.get('window');

const MAP_PINS = [
  { top: 0.15, left: 0.12, label: 'Hagia Sophia', rating: 4.9 },
  { top: 0.28, left: 0.55, label: 'Blue Mosque', rating: 4.8 },
  { top: 0.42, left: 0.22, label: 'Basilica Cistern', rating: 4.7 },
  { top: 0.35, left: 0.75, label: 'Topkapi Palace', rating: 4.6 },
  { top: 0.58, left: 0.48, label: 'Grand Bazaar', rating: 4.5 },
  { top: 0.65, left: 0.18, label: 'Galata Tower', rating: 4.7 },
  { top: 0.50, left: 0.82, label: 'Ortaköy Mosque', rating: 4.8 },
];

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MapFullScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [activePin, setActivePin] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const mapH = H * 0.75;

  const gridBlocks = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    top: (Math.floor(i / 5) * 0.14 + 0.05),
    left: ((i % 5) * 0.18 + 0.04),
    w: 0.14,
    h: 0.07,
  })), []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Full screen map placeholder */}
      <View style={{ flex: 1, position: 'relative' }}>
        {/* Background */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.mapBackground }]} />

        {/* Grid blocks */}
        {gridBlocks.map((b, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              top: b.top * H,
              left: b.left * W,
              width: b.w * W,
              height: b.h * H,
              borderRadius: wScale(4),
              backgroundColor: colors.mapGrid,
              opacity: 0.6,
            }}
          />
        ))}

        {/* Road lines */}
        {[0.25, 0.42, 0.58, 0.72].map((t, i) => (
          <View key={`h${i}`} style={{ position: 'absolute', top: t * H, left: 0, right: 0, height: hScale(2), backgroundColor: colors.white, opacity: 0.9 }} />
        ))}
        {[0.28, 0.52, 0.76].map((l, i) => (
          <View key={`v${i}`} style={{ position: 'absolute', left: l * W, top: 0, bottom: 0, width: wScale(2), backgroundColor: colors.white, opacity: 0.9 }} />
        ))}

        {/* Pins */}
        {MAP_PINS.map((pin, i) => {
          const isActive = activePin === i;
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.85}
              onPress={() => {
                if (isActive) {
                  navigation.navigate('PlaceDetail', {
                    placeId: String(i),
                    name: pin.label,
                    category: 'Landmark',
                    rating: pin.rating,
                    imageUrl: `https://picsum.photos/400/300?random=${i}`,
                  });
                } else {
                  setActivePin(i);
                }
              }}
              style={{ position: 'absolute', top: pin.top * H - hScale(isActive ? 52 : 36), left: pin.left * W, alignItems: 'center', zIndex: isActive ? 10 : 1 }}
              accessibilityLabel={pin.label}
              accessibilityRole="button"
            >
              {isActive && (
                <View style={styles.pinLabel}>
                  <Text style={styles.pinLabelName} numberOfLines={1}>{pin.label}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: wScale(3) }}>
                    <Iconify icon="solar:star-bold" size={wScale(9)} color={colors.warning} />
                    <Text style={styles.pinLabelRating}>{pin.rating}</Text>
                  </View>
                </View>
              )}
              <View style={[styles.pin, isActive && styles.pinActive]}>
                <Iconify icon="solar:map-point-bold" size={wScale(isActive ? 16 : 13)} color={isActive ? '#FFF' : colors.primary} />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Top controls */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => navigation.goBack()}
            accessibilityLabel={t('common.goBack')}
            accessibilityRole="button"
          >
            <Iconify icon="solar:alt-arrow-left-bold" size={wScale(20)} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.titlePill}>
            <Text style={styles.titleText}>{route.params?.title ?? t('map.title')}</Text>
          </View>
          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => Alert.alert(t('map.title'), t('map.layersNotAvailable'))}
            accessibilityLabel="Map layers"
            accessibilityRole="button"
          >
            <Iconify icon="solar:layers-linear" size={wScale(20)} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Zoom controls */}
        <View style={styles.zoomControls}>
          {(['+', '−'] as const).map(label => (
            <TouchableOpacity
              key={label}
              style={styles.zoomBtn}
              onPress={() => setZoom(z => label === '+' ? Math.min(z + 0.25, 3) : Math.max(z - 0.25, 0.5))}
              accessibilityLabel={label === '+' ? 'Zoom in' : 'Zoom out'}
              accessibilityRole="button"
            >
              <Text style={styles.zoomLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom info bar */}
        <View style={styles.bottomBar}>
          <View style={styles.pinCountPill}>
            <Iconify icon="solar:map-point-bold" size={wScale(14)} color={colors.primary} />
            <Text style={styles.pinCountText}>{t('map.placesOnMap', { count: MAP_PINS.length })}</Text>
          </View>
          <TouchableOpacity
            style={styles.listViewBtn}
            onPress={() => navigation.goBack()}
            accessibilityLabel={t('map.listView')}
            accessibilityRole="button"
          >
            <Iconify icon="solar:list-linear" size={wScale(16)} color={colors.primary} />
            <Text style={styles.listViewText}>{t('map.listView')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapFullScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    position: 'absolute', top: Layout.translucentTopOffset, left: wScale(16), right: wScale(16),
    flexDirection: 'row', alignItems: 'center', gap: wScale(10),
  },
  topBtn: {
    width: Layout.hitArea.backButton, height: Layout.hitArea.backButton, borderRadius: Layout.borderRadius.sm,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.stroke, ...Layout.shadow.md,
  },
  titlePill: {
    flex: 1, backgroundColor: colors.white, borderRadius: wScale(12), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(10), alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 4,
  },
  titleText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  pin: {
    width: wScale(30), height: wScale(30), borderRadius: wScale(15),
    backgroundColor: colors.white, borderWidth: 2.5, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  pinActive: { width: wScale(36), height: wScale(36), borderRadius: wScale(18), backgroundColor: colors.primary },
  pinLabel: {
    backgroundColor: colors.white, borderRadius: wScale(10), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(8), paddingVertical: hScale(5), marginBottom: hScale(4), maxWidth: wScale(140),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3,
  },
  pinLabelName: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  pinLabelRating: { fontSize: wScale(10), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary },
  zoomControls: {
    position: 'absolute', right: wScale(16), bottom: hScale(110), gap: hScale(4),
  },
  zoomBtn: {
    width: Layout.hitArea.min, height: Layout.hitArea.min, backgroundColor: colors.white,
    borderRadius: Layout.borderRadius.sm, borderWidth: 1, borderColor: colors.stroke,
    alignItems: 'center', justifyContent: 'center',
    ...Layout.shadow.sm,
  },
  zoomLabel: { fontSize: wScale(20), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, lineHeight: wScale(24) },
  bottomBar: {
    position: 'absolute', bottom: hScale(24), left: wScale(16), right: wScale(16),
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white, borderRadius: wScale(16), padding: wScale(14),
    borderWidth: 1, borderColor: colors.stroke,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 5,
  },
  pinCountPill: { flexDirection: 'row', alignItems: 'center', gap: wScale(6) },
  pinCountText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary },
  listViewBtn: { flexDirection: 'row', alignItems: 'center', gap: wScale(5) },
  listViewText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary },
});
