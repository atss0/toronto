import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, Pressable, KeyboardAvoidingView,
  Platform, ActivityIndicator, RefreshControl, ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types/navigation';
import StackHeader from '../components/StackHeader/StackHeader';
import SkeletonCard from '../components/SkeletonCard/SkeletonCard';
import placesService from '../services/places';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

type RouteT = RouteProp<RootStackParamList, 'Reviews'>;

type SortKey = 'recent' | 'highest' | 'lowest' | 'helpful';

interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  isHelpful?: boolean;
}

interface ReviewSummary {
  average_rating: number;
  total_count: number;
  distribution?: Record<string, number>;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recent',  label: 'Recent'  },
  { key: 'highest', label: 'Highest' },
  { key: 'lowest',  label: 'Lowest'  },
  { key: 'helpful', label: 'Helpful' },
];

const StarRow = ({
  rating, size = 14, onSelect, colors,
}: {
  rating: number; size?: number; onSelect?: (r: number) => void; colors: AppColors;
}) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <TouchableOpacity
        key={i}
        onPress={() => onSelect?.(i)}
        disabled={!onSelect}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        accessibilityLabel={`${i} star${i > 1 ? 's' : ''}`}
        accessibilityRole="button"
      >
        <Iconify
          icon={i <= rating ? 'solar:star-bold' : 'solar:star-linear'}
          size={wScale(size)}
          color={colors.warning}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const ReviewsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const { placeId, placeName, rating } = route.params;
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const user = useSelector((s: RootState) => s.User.user);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({ average_rating: rating, total_count: 0 });
  const [sort, setSort] = useState<SortKey>('recent');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapReview = (r: any): Review => ({
    id: r.id,
    author: r.author,
    initials: r.initials,
    rating: r.rating,
    date: r.date,
    text: r.text,
    helpful: r.helpful_count ?? 0,
    isHelpful: r.is_helpful ?? false,
  });

  const fetchReviews = useCallback(async (p: number, s: SortKey, append: boolean) => {
    try {
      const res = await placesService.getReviews(placeId, { sort: s, page: p, limit: 15 });
      const mapped = (res.data.data ?? []).map(mapReview);
      setReviews(prev => append ? [...prev, ...mapped] : mapped);
      if (res.data.pagination) {
        setHasNext(res.data.pagination.hasNext);
        setPage(p);
      }
      if (res.data.summary) setSummary(res.data.summary);
    } catch {
      // keep existing list on error
    }
  }, [placeId]);

  // Reload from page 1 when sort changes or placeId changes
  useEffect(() => {
    setIsInitialLoading(true);
    setReviews([]);
    fetchReviews(1, sort, false).finally(() => setIsInitialLoading(false));
  }, [placeId, sort, fetchReviews]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasNext) return;
    setIsLoadingMore(true);
    await fetchReviews(page + 1, sort, true);
    setIsLoadingMore(false);
  }, [isLoadingMore, hasNext, page, sort, fetchReviews]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchReviews(1, sort, false);
    setIsRefreshing(false);
  }, [sort, fetchReviews]);

  const toggleHelpful = async (id: string) => {
    setReviews(prev => prev.map(r =>
      r.id === id
        ? { ...r, helpful: r.isHelpful ? r.helpful - 1 : r.helpful + 1, isHelpful: !r.isHelpful }
        : r,
    ));
    try {
      const res = await placesService.markReviewHelpful(id);
      setReviews(prev => prev.map(r =>
        r.id === id ? { ...r, helpful: res.data.data.helpful_count, isHelpful: res.data.data.is_helpful } : r,
      ));
    } catch {
      setReviews(prev => prev.map(r =>
        r.id === id
          ? { ...r, helpful: r.isHelpful ? r.helpful - 1 : r.helpful + 1, isHelpful: !r.isHelpful }
          : r,
      ));
    }
  };

  const submitReview = async () => {
    if (myRating === 0 || !myReview.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await placesService.submitReview(placeId, myRating, myReview.trim());
      const newReview: Review = mapReview(res.data.data);
      setReviews(prev => [newReview, ...prev]);
      setSummary(prev => ({ ...prev, total_count: prev.total_count + 1 }));
    } catch {
      const newReview: Review = {
        id: String(Date.now()),
        author: user?.name ? `${user.name} ${user.surname?.[0] ?? ''}.` : 'Anonymous',
        initials: user?.name ? `${user.name[0]}${user.surname?.[0] ?? ''}` : 'A',
        rating: myRating,
        date: 'Just now',
        text: myReview.trim(),
        helpful: 0,
      };
      setReviews(prev => [newReview, ...prev]);
    } finally {
      setMyRating(0);
      setMyReview('');
      setIsSubmitting(false);
      setShowWriteModal(false);
    }
  };

  const avgRating = summary.average_rating;

  const listHeader = useMemo(() => (
    <View>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.placeName}>{placeName}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.avgRating}>{avgRating.toFixed(1)}</Text>
          <View style={styles.summaryRight}>
            <StarRow rating={Math.round(avgRating)} size={16} colors={colors} />
            <Text style={styles.reviewCount}>
              {summary.total_count || reviews.length} {t('reviews.title').toLowerCase()}
            </Text>
          </View>
        </View>

        {/* Rating distribution */}
        {summary.distribution && (
          <View style={styles.distWrap}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = (summary.distribution as any)[String(star)] ?? 0;
              const pct = summary.total_count > 0 ? count / summary.total_count : 0;
              return (
                <View key={star} style={styles.distRow}>
                  <Text style={styles.distStar}>{star}</Text>
                  <Iconify icon="solar:star-bold" size={wScale(10)} color={colors.warning} />
                  <View style={styles.distBarBg}>
                    <View style={[styles.distBarFill, { width: `${Math.round(pct * 100)}%` as any }]} />
                  </View>
                  <Text style={styles.distCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Sort chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortRow}
      >
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortChip, sort === opt.key && styles.sortChipActive]}
            onPress={() => setSort(opt.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.sortLabel, sort === opt.key && styles.sortLabelActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Initial skeleton */}
      {isInitialLoading && (
        <View style={{ gap: hScale(10) }}>
          {[1, 2, 3].map(i => (
            <SkeletonCard key={i} width="100%" height={hScale(110)} style={{ borderRadius: wScale(14) }} />
          ))}
        </View>
      )}
    </View>
  ), [placeName, avgRating, summary, reviews.length, sort, isInitialLoading, colors, t, styles]);

  return (
    <View style={styles.root}>
      <StackHeader
        title={t('reviews.title')}
        rightIcon="solar:pen-bold"
        rightIconColor={colors.primary}
        onRightPress={() => setShowWriteModal(true)}
      />

      <FlatList
        data={isInitialLoading ? [] : reviews}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.initials}</Text>
              </View>
              <View style={styles.reviewMeta}>
                <Text style={styles.reviewAuthor}>{item.author}</Text>
                <Text style={styles.reviewDate}>{item.date}</Text>
              </View>
              <StarRow rating={item.rating} size={12} colors={colors} />
            </View>
            <Text style={styles.reviewText}>{item.text}</Text>
            <TouchableOpacity
              style={[styles.helpfulBtn, item.isHelpful && styles.helpfulBtnActive]}
              onPress={() => toggleHelpful(item.id)}
              accessibilityLabel={`${t('reviews.helpful')} ${item.helpful}`}
              accessibilityRole="button"
            >
              <Iconify
                icon={item.isHelpful ? 'solar:like-bold' : 'solar:like-linear'}
                size={wScale(14)}
                color={item.isHelpful ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.helpfulText, item.isHelpful && { color: colors.primary }]}>
                {t('reviews.helpful')} ({item.helpful})
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator color={colors.primary} style={styles.loadingMore} />
          ) : hasNext ? (
            <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore} activeOpacity={0.8}>
              <Text style={styles.loadMoreText}>{t('common.loadMore') ?? 'Load More'}</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Write Review Modal */}
      <Modal visible={showWriteModal} transparent animationType="slide" onRequestClose={() => setShowWriteModal(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowWriteModal(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ justifyContent: 'flex-end', flex: 1 }}>
            <Pressable style={styles.modalSheet} onPress={() => {}}>
              <Text style={styles.modalTitle}>{t('reviews.writeReview')}</Text>
              <Text style={styles.modalPlaceName}>{placeName}</Text>

              <View style={styles.starPickerWrap}>
                <StarRow rating={myRating} size={28} onSelect={setMyRating} colors={colors} />
                {myRating > 0 && (
                  <Text style={styles.ratingLabel}>
                    {(t('reviews.reviewLabels', { returnObjects: true }) as string[])[myRating]}
                  </Text>
                )}
              </View>

              <TextInput
                style={styles.reviewInput}
                placeholder={t('reviews.shareExperience')}
                placeholderTextColor={colors.textSecondary}
                value={myReview}
                onChangeText={setMyReview}
                multiline
                numberOfLines={4}
                accessibilityLabel={t('reviews.shareExperience')}
              />

              <TouchableOpacity
                style={[styles.submitBtn, (myRating === 0 || !myReview.trim()) && styles.submitBtnDisabled]}
                onPress={submitReview}
                disabled={myRating === 0 || !myReview.trim() || isSubmitting}
                activeOpacity={0.85}
                accessibilityLabel={t('reviews.submitReview')}
                accessibilityRole="button"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>{t('reviews.submitReview')}</Text>
                )}
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ReviewsScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  list: { padding: Layout.screenPaddingH, gap: hScale(12), paddingBottom: hScale(40) },

  // Summary card
  summaryCard: {
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.xl,
    borderWidth: 1, borderColor: colors.stroke, padding: wScale(20), marginBottom: hScale(8),
  },
  placeName: {
    fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold,
    color: colors.textPrimary, marginBottom: hScale(10),
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(16) },
  avgRating: {
    fontSize: wScale(40), fontFamily: Fonts.plusJakartaSansExtraBold,
    color: colors.textPrimary, letterSpacing: -1,
  },
  summaryRight: { gap: hScale(4) },
  reviewCount: {
    fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary,
  },

  // Distribution
  distWrap: { marginTop: hScale(14), gap: hScale(5) },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(6) },
  distStar: {
    fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansSemiBold,
    color: colors.textSecondary, width: wScale(10), textAlign: 'right',
  },
  distBarBg: {
    flex: 1, height: hScale(6), backgroundColor: colors.stroke, borderRadius: wScale(3), overflow: 'hidden',
  },
  distBarFill: { height: '100%', backgroundColor: colors.warning, borderRadius: wScale(3) },
  distCount: {
    fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary, width: wScale(30), textAlign: 'right',
  },

  // Sort chips
  sortRow: { paddingVertical: hScale(8), gap: wScale(8), marginBottom: hScale(4) },
  sortChip: {
    paddingHorizontal: wScale(14), paddingVertical: hScale(7),
    backgroundColor: colors.white, borderRadius: wScale(20),
    borderWidth: 1, borderColor: colors.stroke,
  },
  sortChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sortLabel: {
    fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.textSecondary,
  },
  sortLabelActive: { color: '#FFFFFF' },

  // Review card
  reviewCard: {
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.lg,
    borderWidth: 1, borderColor: colors.stroke, padding: wScale(14),
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: wScale(10), marginBottom: hScale(10) },
  avatar: {
    width: wScale(38), height: wScale(38), borderRadius: wScale(19),
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary },
  reviewMeta: { flex: 1 },
  reviewAuthor: {
    fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary,
  },
  reviewDate: {
    fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary,
  },
  reviewText: {
    fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary, lineHeight: hScale(20), marginBottom: hScale(10),
  },
  helpfulBtn: { flexDirection: 'row', alignItems: 'center', gap: wScale(4), paddingVertical: hScale(4) },
  helpfulBtnActive: { opacity: 1 },
  helpfulText: {
    fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary,
  },

  // Load more
  loadingMore: { paddingVertical: hScale(16) },
  loadMoreBtn: {
    alignItems: 'center', paddingVertical: hScale(13),
    borderWidth: 1, borderColor: colors.stroke, borderRadius: wScale(16),
    backgroundColor: colors.white,
  },
  loadMoreText: {
    fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary,
  },

  // Write modal
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: Layout.borderRadius.pill, borderTopRightRadius: Layout.borderRadius.pill,
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(24), paddingBottom: hScale(40), gap: hScale(14),
  },
  modalTitle: {
    fontSize: wScale(18), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary,
  },
  modalPlaceName: {
    fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary, marginTop: hScale(-8),
  },
  starPickerWrap: { alignItems: 'center', gap: hScale(6), paddingVertical: hScale(8) },
  ratingLabel: {
    fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary,
  },
  reviewInput: {
    backgroundColor: colors.inputBackground, borderRadius: Layout.borderRadius.md,
    borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(12),
    fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary,
    minHeight: hScale(100), textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: colors.primary, borderRadius: Layout.borderRadius.lg,
    paddingVertical: hScale(15), alignItems: 'center',
    ...Layout.shadow.md, shadowColor: colors.primary,
  },
  submitBtnDisabled: { backgroundColor: colors.textSecondary, shadowOpacity: 0, elevation: 0 },
  submitBtnText: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF' },
});
