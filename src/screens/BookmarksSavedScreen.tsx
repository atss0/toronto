import React, { useMemo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types/navigation';
import StackHeader from '../components/StackHeader/StackHeader';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';
import mockData from '../data/mock.json';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const BOOKMARKS = mockData.bookmarks;

const FILTER_TABS = ['All', 'Museums', 'Historic', 'Shopping', 'Dining'];

const BookmarksSavedScreen = () => {
  const navigation = useNavigation<Nav>();
  const colors = useColors();
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState('All');
  const [bookmarks, setBookmarks] = useState(BOOKMARKS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const removeBookmark = useCallback((id: string) =>
    setBookmarks(prev => prev.filter(b => b.id !== id)), []);

  const filtered = activeTab === 'All'
    ? bookmarks
    : bookmarks.filter(b => b.category === activeTab);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  const renderItem = useCallback(({ item }: { item: typeof BOOKMARKS[0] }) => (
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
      accessibilityLabel={`${item.name}, ${item.category}`}
      accessibilityRole="button"
    >
      <Image source={{ uri: item.imageUrl }} style={styles.thumb} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.category}>{item.category} · {item.location}</Text>
        <View style={styles.metaRow}>
          <Iconify icon="solar:star-bold" size={wScale(11)} color={colors.warning} />
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          <View style={styles.dot} />
          <Text style={styles.savedAt}>{t('bookmarks.savedAgo', { time: item.savedAt })}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => removeBookmark(item.id)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel={`Remove ${item.name}`}
        accessibilityRole="button"
      >
        <Iconify icon="solar:bookmark-bold" size={wScale(20)} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [styles, colors, navigation, t, removeBookmark]);

  return (
    <View style={styles.root}>
      <StackHeader
        title={t('bookmarks.title')}
        rightComponent={
          <Text style={styles.countText}>{bookmarks.length}</Text>
        }
      />

      {/* Tabs */}
      <View style={styles.tabsWrap}>
        {FILTER_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, tab === activeTab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
            accessibilityLabel={`Filter: ${tab}`}
            accessibilityRole="button"
            accessibilityState={{ selected: tab === activeTab }}
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
        renderItem={renderItem}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Iconify icon="solar:bookmark-linear" size={wScale(48)} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>{t('bookmarks.noBookmarks')}</Text>
            <Text style={styles.emptySubtitle}>{t('bookmarks.noBookmarksSub')}</Text>
          </View>
        }
      />
    </View>
  );
};

export default BookmarksSavedScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  countText: {
    fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary,
    backgroundColor: colors.primaryLight, paddingHorizontal: wScale(10), paddingVertical: hScale(3), borderRadius: Layout.borderRadius.sm,
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
