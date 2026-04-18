import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar, Modal, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { useSelector } from 'react-redux';

import { RootStackParamList } from '../types/navigation';
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
}

const MOCK_REVIEWS: Review[] = [
  { id: '1', author: 'Sarah M.', initials: 'SM', rating: 5, date: 'March 2025', text: 'Absolutely breathtaking! The architecture is beyond anything I\'ve ever seen. Definitely worth every minute.', helpful: 24 },
  { id: '2', author: 'James T.', initials: 'JT', rating: 4, date: 'February 2025', text: 'Incredible historical site. Get there early to avoid the crowds. The interior mosaics are stunning.', helpful: 18 },
  { id: '3', author: 'Yuki A.', initials: 'YA', rating: 5, date: 'January 2025', text: 'One of the most remarkable places I\'ve visited in my life. The scale and history is overwhelming in the best way.', helpful: 31 },
  { id: '4', author: 'Marco L.', initials: 'ML', rating: 3, date: 'December 2024', text: 'Beautiful place but very crowded. The audio guide is worth it. Plan at least 2 hours.', helpful: 9 },
];

const StarRow = ({ rating, size = 14, onSelect }: { rating: number; size?: number; onSelect?: (r: number) => void }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <TouchableOpacity key={i} onPress={() => onSelect?.(i)} disabled={!onSelect} hitSlop={4}>
        <Iconify
          icon={i <= rating ? 'solar:star-bold' : 'solar:star-linear'}
          size={wScale(size)}
          color="#F59E0B"
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
  const currentTheme = useSelector((s: RootState) => s.Theme.theme);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const user = useSelector((s: RootState) => s.User.user);

  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [helpfulIds, setHelpfulIds] = useState<string[]>([]);

  const toggleHelpful = (id: string) => {
    setHelpfulIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful: helpfulIds.includes(id) ? r.helpful - 1 : r.helpful + 1 } : r));
  };

  const submitReview = () => {
    if (myRating === 0 || !myReview.trim()) return;
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
    setShowWriteModal(false);
  };

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.inputBackground} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Iconify icon="solar:alt-arrow-left-linear" size={wScale(22)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <TouchableOpacity style={styles.writeBtn} onPress={() => setShowWriteModal(true)}>
          <Iconify icon="solar:pen-bold" size={wScale(16)} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.placeName}>{placeName}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.avgRating}>{avgRating.toFixed(1)}</Text>
              <View style={styles.summaryRight}>
                <StarRow rating={Math.round(avgRating)} size={16} />
                <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
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
              <StarRow rating={item.rating} size={12} />
            </View>
            <Text style={styles.reviewText}>{item.text}</Text>
            <TouchableOpacity style={styles.helpfulBtn} onPress={() => toggleHelpful(item.id)} hitSlop={6}>
              <Iconify
                icon={helpfulIds.includes(item.id) ? 'solar:like-bold' : 'solar:like-linear'}
                size={wScale(14)}
                color={helpfulIds.includes(item.id) ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.helpfulText, helpfulIds.includes(item.id) && { color: colors.primary }]}>
                Helpful ({item.helpful})
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Write Review Modal */}
      <Modal visible={showWriteModal} transparent animationType="slide" onRequestClose={() => setShowWriteModal(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable style={styles.backdrop} onPress={() => setShowWriteModal(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.modalTitle}>Write a Review</Text>
            <Text style={styles.modalPlaceName}>{placeName}</Text>

            <View style={styles.starPickerWrap}>
              <StarRow rating={myRating} size={28} onSelect={setMyRating} />
              {myRating > 0 && (
                <Text style={styles.ratingLabel}>{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][myRating]}</Text>
              )}
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience..."
              placeholderTextColor={colors.textSecondary}
              value={myReview}
              onChangeText={setMyReview}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[styles.submitBtn, (myRating === 0 || !myReview.trim()) && styles.submitBtnDisabled]}
              onPress={submitReview}
              disabled={myRating === 0 || !myReview.trim()}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>Submit Review</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default ReviewsScreen;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(16), paddingBottom: hScale(14),
    backgroundColor: colors.inputBackground, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  backBtn: { width: wScale(36), height: wScale(36), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wScale(17), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary },
  writeBtn: {
    width: wScale(36), height: wScale(36), borderRadius: wScale(10), backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  list: { padding: Layout.screenPaddingH, gap: hScale(12), paddingBottom: hScale(40) },
  summaryCard: {
    backgroundColor: colors.white, borderRadius: wScale(18), borderWidth: 1, borderColor: colors.stroke,
    padding: wScale(20), marginBottom: hScale(8),
  },
  placeName: { fontSize: wScale(16), fontFamily: Fonts.plusJakartaSansBold, color: colors.textPrimary, marginBottom: hScale(10) },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: wScale(16) },
  avgRating: { fontSize: wScale(40), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary, letterSpacing: -1 },
  summaryRight: { gap: hScale(4) },
  reviewCount: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary },
  reviewCard: {
    backgroundColor: colors.white, borderRadius: wScale(16), borderWidth: 1, borderColor: colors.stroke, padding: wScale(14),
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
  helpfulBtn: { flexDirection: 'row', alignItems: 'center', gap: wScale(4) },
  helpfulText: { fontSize: wScale(12), fontFamily: Fonts.plusJakartaSansMedium, color: colors.textSecondary },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.white, borderTopLeftRadius: wScale(24), borderTopRightRadius: wScale(24),
    paddingHorizontal: Layout.screenPaddingH, paddingTop: hScale(24), paddingBottom: hScale(40), gap: hScale(14),
  },
  modalTitle: { fontSize: wScale(18), fontFamily: Fonts.plusJakartaSansExtraBold, color: colors.textPrimary },
  modalPlaceName: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textSecondary, marginTop: hScale(-8) },
  starPickerWrap: { alignItems: 'center', gap: hScale(6), paddingVertical: hScale(8) },
  ratingLabel: { fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansSemiBold, color: colors.primary },
  reviewInput: {
    backgroundColor: colors.inputBackground, borderRadius: wScale(14), borderWidth: 1, borderColor: colors.stroke,
    paddingHorizontal: wScale(14), paddingVertical: hScale(12),
    fontSize: wScale(14), fontFamily: Fonts.plusJakartaSansRegular, color: colors.textPrimary,
    minHeight: hScale(100), textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: colors.primary, borderRadius: wScale(16), paddingVertical: hScale(15), alignItems: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  submitBtnDisabled: { backgroundColor: colors.textSecondary, shadowOpacity: 0, elevation: 0 },
  submitBtnText: { fontSize: wScale(15), fontFamily: Fonts.plusJakartaSansBold, color: '#FFFFFF' },
});
