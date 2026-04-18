import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { RootStackParamList } from '../types/navigation';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

type RouteT = RouteProp<RootStackParamList, 'PlaceDetail'>;

const HOURS = [
  { day: 'Monday – Friday', hours: '09:00 – 22:00' },
  { day: 'Saturday',        hours: '10:00 – 23:00' },
  { day: 'Sunday',          hours: '10:00 – 21:00' },
];

const TAGS = ['Museum', 'Historic', 'Art', 'Culture'];

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PlaceDetailScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { name, category, rating, imageUrl, distance, price, reviewCount } = route.params;
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: imageUrl }} style={styles.hero} resizeMode="cover" />
          <View style={styles.heroOverlay} />

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Iconify icon="solar:alt-arrow-left-bold" size={wScale(20)} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn}>
            <Iconify icon="solar:bookmark-linear" size={wScale(20)} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{name}</Text>
            <Text style={styles.heroCategory}>{category}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Rating Row */}
          <View style={styles.metaRow}>
            <View style={styles.ratingPill}>
              <Iconify icon="solar:star-bold" size={wScale(13)} color="#F59E0B" />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
              {reviewCount != null && (
                <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
              )}
            </View>
            {distance && (
              <View style={styles.metaPill}>
                <Iconify icon="solar:map-point-linear" size={wScale(13)} color={colors.textSecondary} />
                <Text style={styles.metaPillText}>{distance}</Text>
              </View>
            )}
            {price && (
              <View style={styles.metaPill}>
                <Iconify icon="solar:dollar-minimalistic-linear" size={wScale(13)} color={colors.textSecondary} />
                <Text style={styles.metaPillText}>{price}</Text>
              </View>
            )}
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {TAGS.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              A remarkable destination offering an unforgettable experience. Visitors can enjoy
              stunning views, rich history, and a vibrant atmosphere that captures the essence of
              the city. Whether you're a history buff, art lover, or simply looking for a beautiful
              place to explore, this spot has something for everyone.
            </Text>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapPlaceholder}>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.mapBackground, borderRadius: wScale(14) }]} />
              <View style={styles.mapPin}>
                <Iconify icon="solar:map-point-bold" size={wScale(28)} color={colors.primary} />
              </View>
              <Text style={styles.mapAddress}>123 Example Street, Istanbul</Text>
            </View>
          </View>

          {/* Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            <View style={styles.hoursCard}>
              {HOURS.map((h, i) => (
                <View key={h.day} style={[styles.hourRow, i < HOURS.length - 1 && styles.hourBorder]}>
                  <Text style={styles.hourDay}>{h.day}</Text>
                  <Text style={styles.hourTime}>{h.hours}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.reviewsBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Reviews', { placeId: route.params.placeId, placeName: name, rating })}
        >
          <Iconify icon="solar:star-linear" size={wScale(16)} color={colors.primary} />
          <Text style={styles.reviewsBtnText}>Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addRouteBtn} activeOpacity={0.85}>
          <Iconify icon="solar:route-bold" size={wScale(18)} color="#FFFFFF" />
          <Text style={styles.addRouteBtnText}>Add to Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlaceDetailScreen;

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },

    heroWrap: { width: '100%', height: hScale(300), position: 'relative' },
    hero: { width: '100%', height: '100%' },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    backBtn: {
      position: 'absolute',
      top: hScale(52),
      left: wScale(16),
      width: wScale(40),
      height: wScale(40),
      borderRadius: wScale(20),
      backgroundColor: 'rgba(0,0,0,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveBtn: {
      position: 'absolute',
      top: hScale(52),
      right: wScale(16),
      width: wScale(40),
      height: wScale(40),
      borderRadius: wScale(20),
      backgroundColor: 'rgba(0,0,0,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroInfo: {
      position: 'absolute',
      bottom: hScale(20),
      left: wScale(20),
      right: wScale(20),
    },
    heroName: {
      fontSize: wScale(24),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: '#FFFFFF',
      letterSpacing: -0.3,
      marginBottom: hScale(4),
    },
    heroCategory: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: 'rgba(255,255,255,0.8)',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },

    content: { paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(20), paddingBottom: hScale(20) },

    metaRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(8), marginBottom: hScale(14) },
    ratingPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(4),
      backgroundColor: colors.warningLight,
      paddingHorizontal: wScale(10),
      paddingVertical: hScale(6),
      borderRadius: wScale(20),
    },
    ratingText: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansBold,
      color: colors.warning,
    },
    reviewCount: {
      fontSize: wScale(11),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
    },
    metaPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wScale(4),
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.stroke,
      paddingHorizontal: wScale(10),
      paddingVertical: hScale(6),
      borderRadius: wScale(20),
    },
    metaPillText: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansMedium,
      color: colors.textSecondary,
    },

    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: wScale(8), marginBottom: hScale(24) },
    tag: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: wScale(12),
      paddingVertical: hScale(5),
      borderRadius: wScale(20),
    },
    tagText: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.primary,
    },

    section: { marginBottom: hScale(24) },
    sectionTitle: {
      fontSize: wScale(16),
      fontFamily: Fonts.plusJakartaSansExtraBold,
      color: colors.textPrimary,
      marginBottom: hScale(10),
    },
    description: {
      fontSize: wScale(14),
      fontFamily: Fonts.plusJakartaSansRegular,
      color: colors.textSecondary,
      lineHeight: hScale(22),
    },

    mapPlaceholder: {
      height: hScale(160),
      borderRadius: wScale(14),
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      gap: hScale(8),
      borderWidth: 1,
      borderColor: colors.stroke,
    },
    mapPin: { alignItems: 'center' },
    mapAddress: {
      fontSize: wScale(12),
      fontFamily: Fonts.plusJakartaSansMedium,
      color: colors.textSecondary,
    },

    hoursCard: {
      backgroundColor: colors.white,
      borderRadius: wScale(14),
      borderWidth: 1,
      borderColor: colors.stroke,
      paddingHorizontal: wScale(16),
    },
    hourRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: hScale(12),
    },
    hourBorder: { borderBottomWidth: 1, borderBottomColor: colors.stroke },
    hourDay: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansMedium,
      color: colors.textPrimary,
    },
    hourTime: {
      fontSize: wScale(13),
      fontFamily: Fonts.plusJakartaSansSemiBold,
      color: colors.primary,
    },

    footer: {
      flexDirection: 'row',
      gap: wScale(10),
      paddingHorizontal: Layout.screenPaddingH,
      paddingVertical: hScale(14),
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: colors.stroke,
    },
    reviewsBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: wScale(6),
      borderWidth: 1.5, borderColor: colors.primary, borderRadius: wScale(16),
      paddingVertical: hScale(14), paddingHorizontal: wScale(18),
    },
    reviewsBtnText: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary },
    addRouteBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: wScale(8),
      backgroundColor: colors.primary,
      borderRadius: wScale(16),
      paddingVertical: hScale(14),
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    addRouteBtnText: {
      fontSize: wScale(15),
      fontFamily: Fonts.plusJakartaSansBold,
      color: '#FFFFFF',
    },
  });
