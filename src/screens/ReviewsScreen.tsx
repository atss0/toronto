import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, Pressable, KeyboardAvoidingView,
  Platform, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types/navigation';
import StackHeader from '../components/StackHeader/StackHeader';
import { useColors } from '../context/ThemeContext';
import { AppColors } from '../styles/theme';
import Fonts from '../styles/Fonts';
import { wScale, hScale } from '../styles/Scaler';
import Layout from '../styles/Layout';
import { RootState } from '../redux/store';

type RouteT = RouteProp<RootStackParamList, 'Reviews'>;

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

const MOCK_REVIEWS: Review[] = [
  { id: '1', author: 'Sarah M.', initials: 'SM', rating: 5, date: 'March 2025', text: 'Absolutely breathtaking! The architecture is beyond anything I\'ve ever seen. Definitely worth every minute.', helpful: 24 },
  { id: '2', author: 'James T.', initials: 'JT', rating: 4, date: 'February 2025', text: 'Incredible historical site. Get there early to avoid the crowds. The interior mosaics are stunning.', helpful: 18 },
  { id: '3', author: 'Yuki A.', initials: 'YA', rating: 5, date: 'January 2025', text: 'One of the most remarkable places I\'ve visited in my life. The scale and history is overwhelming in the best way.', helpful: 31 },
  { id: '4', author: 'Marco L.', initials: 'ML', rating: 3, date: 'December 2024', text: 'Beautiful place but very crowded. The audio guide is worth it. Plan at least 2 hours.', helpful: 9 },
];

const StarRow = ({ rating, size = 14, onSelect, colors }: { rating: number; size?: number; onSelect?: (r: number) => void; colors: AppColors }) => (
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
  const { placeName, rating } = route.params;
  const colors = useColors();
  const { t } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const user = useSelector((s: RootState) => s.User.user);

  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleHelpful = (id: string) => {
    setReviews(prev => prev.map(r =>
      r.id === id
        ? { ...r, helpful: r.isHelpful ? r.helpful - 1 : r.helpful + 1, isHelpful: !r.isHelpful }
        : r
    ));
  };

  const submitReview = () => {
    if (myRating === 0 || !myReview.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
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
      setMyRating(0);
      setMyReview('');
      setIsSubmitting(false);
      setShowWriteModal(false);
    }, 800);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <View style={styles.root}>
      <StackHeader
        title={t('reviews.title')}
        rightIcon="solar:pen-bold"
        rightIconColor={colors.primary}
        onRightPress={() => setShowWriteModal(true)}
      />

      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.placeName}>{placeName}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.avgRating}>{avgRating.toFixed(1)}</Text>
              <View style={styles.summaryRight}>
                <StarRow rating={Math.round(avgRating)} size={16} colors={colors} />
                <Text style={styles.reviewCount}>{reviews.length} {t('reviews.title').toLowerCase()}</Text>
              </View>
            </View>
          </View>
        }
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
  summaryCard: {
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.xl, borderWidth: 1, borderColor: colors.stroke,
    padding: wScale(20), marginBottom: hScale(8),
  },
  placeName: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, marginBottom: hScale(10) },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(16) },
  avgRating: { fontSize: wScale(40), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary, letterSpacing: -1 },
  summaryRight: { gap: hScale(4) },
  reviewCount: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  reviewCard: {
    backgroundColor: colors.white, borderRadius: Layout.borderRadius.lg, borderWidth: 1, borderColor: colors.stroke, padding: wScale(14),
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: wScale(10), marginBottom: hScale(10) },
  avatar: {
    width: wScale(38), height: wScale(38), borderRadius: wScale(19),
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansBold, color: colors.primary },
  reviewMeta: { flex: 1 },
  reviewAuthor: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  reviewDate: { fontSize: wScale(11), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  reviewText: { fontSize: wScale(13), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, lineHeight: hScale(20), marginBottom: hScale(10) },
  helpfulBtn: { flexDirection: 'row', alignItems: 'center', gap: wScale(4), paddingVertical: hScale(4) },
  helpfulBtnActive: { opacity: 1 },
  helpfulText: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.white, borderTopLeftRadius: Layout.borderRadius.pill, borderTopRightRadius: Layout.borderRadius.pill,
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(24), paddingBottom: hScale(40), gap: hScale(14),
  },
  modalTitle: { fontSize: wScale(18), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary },
  modalPlaceName: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginTop: hScale(-8) },
  starPickerWrap: { alignItems: 'center', gap: hScale(6), paddingVertical: hScale(8) },
  ratingLabel: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },
  reviewInput: {
    backgroundColor: colors.inputBackground, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(12),
    fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary,
    minHeight: hScale(100), textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: colors.primary, borderRadius: Layout.borderRadius.lg, paddingVertical: hScale(15), alignItems: 'center',
    ...Layout.shadow.md,
    shadowColor: colors.primary,
  },
  submitBtnDisabled: { backgroundColor: colors.textSecondary, shadowOpacity: 0, elevation: 0 },
  submitBtnText: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF' },
});
