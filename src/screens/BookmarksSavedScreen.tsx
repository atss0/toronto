import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const BOOKMARKS = [
  { id: '1', name: 'Hagia Sophia', category: 'Museum', rating: 4.9, location: 'Sultanahmet', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80&fit=crop', savedAt: '2 days ago' },
  { id: '2', name: 'Galata Tower', category: 'Historic', rating: 4.6, location: 'Beyoğlu', imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80&fit=crop', savedAt: '1 week ago' },
  { id: '3', name: 'Grand Bazaar', category: 'Shopping', rating: 4.5, location: 'Fatih', imageUrl: 'https://images.unsplash.com/photo-1519822472072-ec86d5ab6f5c?w=400&q=80&fit=crop', savedAt: '2 weeks ago' },
  { id: '4', name: 'Blue Mosque', category: 'Historic', rating: 4.8, location: 'Sultanahmet', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80&fit=crop', savedAt: '3 weeks ago' },
];

const FILTER_TABS = ['All', 'Museums', 'Historic', 'Shopping', 'Dining'];

const BookmarksSavedScreen = () => {
  const navigation = useNavigation<Nav>();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState('All');
  const [bookmarks, setBookmarks] = useState(BOOKMARKS);

  const removeBookmark = (id: string) =>
    setBookmarks(prev => prev.filter(b => b.id !== id));

  const filtered = activeTab === 'All'
    ? bookmarks
    : bookmarks.filter(b => b.category === activeTab);

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Places</Text>
        <Text style={styles.countText}>{bookmarks.length}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrap}>
        {FILTER_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, tab === activeTab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === activeTab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PlaceDetail', {
              placeId: item.id,
              name: item.name,
              category: item.category,
              rating: item.rating,
              imageUrl: item.imageUrl,
            })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.thumb} resizeMode="cover" />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.category}>{item.category} · {item.location}</Text>
              <View style={styles.metaRow}>
                <Iconify icon="solar:star-bold" size={wScale(11)} color="#F59E0B" />
                <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                <View style={styles.dot} />
                <Text style={styles.savedAt}>Saved {item.savedAt}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeBookmark(item.id)} hitSlop={8}>
              <Iconify icon="solar:bookmark-bold" size={wScale(20)} color={colors.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Iconify icon="solar:bookmark-linear" size={wScale(48)} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No saved places</Text>
            <Text style={styles.emptySubtitle}>Bookmark places to find them here</Text>
          </View>
        }
      />
    </View>
  );
};

export default BookmarksSavedScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  countText: {
    fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary,
    backgroundColor: colors.primaryLight, paddingHorizontal: wScale(10), paddingVertical: hScale(3), borderRadius: wScale(12),
  },
  tabsWrap: {
    flexDirection: 'row', paddingHorizontal: Layout.screenPaddingH, paddingVertical: hScale(12),
    gap: wScale(8), backgroundColor: colors.inputBackground,
  },
  tab: {
    paddingHorizontal: wScale(14), paddingVertical: hScale(7),
    backgroundColor: colors.white, borderRadius: wScale(20), borderWidth: 1, borderColor: colors.stroke,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary },
  tabTextActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(12), paddingBottom: hScale(40), gap: hScale(10) },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: wScale(12),
    backgroundColor: colors.white, borderRadius: wScale(16), borderWidth: 1, borderColor: colors.stroke, padding: wScale(12),
  },
  thumb: { width: wScale(66), height: wScale(66), borderRadius: wScale(12), backgroundColor: colors.cardDark },
  info: { flex: 1 },
  name: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary, marginBottom: hScale(2) },
  category: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginBottom: hScale(4) },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(4) },
  rating: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textPrimary },
  dot: { width: wScale(3), height: wScale(3), borderRadius: wScale(2), backgroundColor: colors.textSecondary },
  savedAt: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  empty: { alignItems: 'center', paddingVertical: hScale(60), gap: hScale(10) },
  emptyTitle: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  emptySubtitle: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
});
