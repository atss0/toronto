import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Iconify } from 'react-native-iconify';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';

interface PlaceListItemProps {
  name: string;
  category?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  isLiked?: boolean;
  imageSource?: ImageSourcePropType;
  placeholderColor?: string;
  onPress?: () => void;
  onLikePress?: () => void;
}

const PlaceListItem: React.FC<PlaceListItemProps> = ({
  name,
  category,
  location,
  rating,
  reviewCount,
  price,
  isLiked: initialLiked = false,
  imageSource,
  placeholderColor = Colors.cardDark,
  onPress,
  onLikePress,
}) => {
  const [liked, setLiked] = useState(initialLiked);

  const handleLike = () => {
    setLiked(prev => !prev);
    onLikePress?.();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Sol: fotoğraf */}
      <View style={styles.imageWrap}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, { backgroundColor: placeholderColor }]} />
        )}
      </View>

      {/* Orta: bilgi */}
      <View style={styles.info}>
        {category && (
          <View style={styles.categoryRow}>
            <View style={styles.categoryDot} />
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}

        <Text style={styles.name} numberOfLines={2}>{name}</Text>

        {location && (
          <View style={styles.locationRow}>
            <Iconify icon="solar:map-point-linear" size={wScale(12)} color={Colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
          </View>
        )}

        <View style={styles.bottomRow}>
          {rating !== undefined && (
            <View style={styles.ratingRow}>
              <Iconify icon="solar:star-bold" size={wScale(12)} color={Colors.warning} />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
              {reviewCount !== undefined && (
                <Text style={styles.reviewCount}>({reviewCount.toLocaleString()})</Text>
              )}
            </View>
          )}
          {price && (
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>{price}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Sağ: beğeni butonu */}
      <TouchableOpacity
        style={[styles.likeBtn, liked && styles.likeBtnActive]}
        onPress={handleLike}
        hitSlop={8}
      >
        <Iconify
          icon={liked ? 'solar:heart-bold' : 'solar:heart-linear'}
          size={wScale(18)}
          color={liked ? Colors.danger : Colors.textSecondary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default PlaceListItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wScale(16),
    padding: wScale(12),
    gap: wScale(12),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  imageWrap: {
    borderRadius: wScale(12),
    overflow: 'hidden',
  },
  image: {
    width: wScale(82),
    height: wScale(82),
    borderRadius: wScale(12),
  },

  info: {
    flex: 1,
    gap: hScale(4),
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(5),
  },
  categoryDot: {
    width: wScale(6),
    height: wScale(6),
    borderRadius: wScale(3),
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  name: {
    fontSize: wScale(14),
    fontFamily: Fonts.plusJakartaSansBold,
    color: Colors.textPrimary,
    lineHeight: hScale(20),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(3),
  },
  locationText: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textSecondary,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(8),
    marginTop: hScale(2),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(3),
  },
  ratingText: {
    fontSize: wScale(12),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.textPrimary,
  },
  reviewCount: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textSecondary,
  },
  priceBadge: {
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: wScale(7),
    paddingVertical: hScale(2),
    borderRadius: wScale(6),
  },
  priceText: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.textSecondary,
  },

  likeBtn: {
    width: wScale(36),
    height: wScale(36),
    borderRadius: wScale(10),
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  likeBtnActive: {
    backgroundColor: Colors.dangerLight,
  },
});
