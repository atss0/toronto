import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useColors } from '../../context/ThemeContext';
import { AppColors } from '../../styles/theme';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';

interface TrendingCardProps {
  name: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  badge?: string;
  imageSource?: ImageSourcePropType;
  placeholderColor?: string;
  onPress?: () => void;
}

const TrendingCard: React.FC<TrendingCardProps> = ({
  name,
  category,
  rating,
  reviewCount,
  price,
  badge,
  imageSource,
  placeholderColor,
  onPress,
}) => {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const bgFallback = placeholderColor ?? colors.cardDark;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {imageSource ? (
        <Image source={imageSource} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: bgFallback }]} />
      )}

      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          {badge && (
            <View style={styles.badgeWrap}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
          {category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
            </View>
          )}
        </View>
        {price && (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{price}</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomContent}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        {(rating !== undefined || reviewCount !== undefined) && (
          <View style={styles.ratingRow}>
            <Iconify icon="solar:star-bold" size={wScale(11)} color={colors.warning} />
            {rating !== undefined && (
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            )}
            {reviewCount !== undefined && (
              <Text style={styles.reviewText}>· {reviewCount.toLocaleString()} reviews</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TrendingCard;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  card: {
    width: wScale(180),
    height: hScale(150),
    borderRadius: wScale(18),
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(10,20,40,0.45)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: wScale(10),
    gap: wScale(6),
  },
  topLeft: {
    flex: 1,
    gap: wScale(5),
  },
  badgeWrap: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warning,
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(3),
    borderRadius: wScale(8),
  },
  badgeText: {
    fontSize: wScale(8),
    fontFamily: Fonts.plusJakartaSansBold,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(3),
    borderRadius: wScale(8),
  },
  categoryText: {
    fontSize: wScale(8),
    fontFamily: Fonts.plusJakartaSansBold,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  priceBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(3),
    borderRadius: wScale(8),
  },
  priceText: {
    fontSize: wScale(10),
    fontFamily: Fonts.plusJakartaSansBold,
    color: '#FFFFFF',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wScale(12),
    paddingBottom: hScale(13),
    gap: hScale(4),
  },
  name: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansBold,
    color: '#FFFFFF',
    lineHeight: hScale(18),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(3),
  },
  ratingText: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: '#FFFFFF',
  },
  reviewText: {
    fontSize: wScale(10),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: 'rgba(255,255,255,0.85)',
  },
});
