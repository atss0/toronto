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

interface GemCardProps {
  name: string;
  category?: string;
  distance?: string;
  rating?: number;
  imageSource?: ImageSourcePropType;
  placeholderColor?: string;
  onPress?: () => void;
}

const GemCard: React.FC<GemCardProps> = ({
  name,
  category,
  distance,
  rating,
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

      {distance && (
        <View style={styles.topRow}>
          <View style={styles.distanceBadge}>
            <Iconify icon="solar:map-point-bold" size={wScale(10)} color='#FFFFFF' />
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        </View>
      )}

      <View style={styles.bottomOverlay}>
        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        {rating !== undefined && (
          <View style={styles.ratingRow}>
            <Iconify icon="solar:star-bold" size={wScale(11)} color={colors.warning} />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GemCard;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  card: {
    width: wScale(148),
    height: hScale(200),
    borderRadius: wScale(18),
    overflow: 'hidden',
  },
  topRow: {
    padding: wScale(10),
    alignItems: 'flex-end',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(3),
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(4),
    borderRadius: wScale(12),
  },
  distanceText: {
    fontSize: wScale(10),
    fontFamily: Fonts.plusJakartaSansMedium,
    color: '#FFFFFF',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wScale(12),
    paddingBottom: hScale(14),
    backgroundColor: 'rgba(10,20,40,0.72)',
    gap: hScale(5),
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(49,130,237,0.9)',
    paddingHorizontal: wScale(7),
    paddingVertical: hScale(2),
    borderRadius: wScale(6),
  },
  categoryText: {
    fontSize: wScale(8),
    fontFamily: Fonts.plusJakartaSansBold,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  name: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansBold,
    color: '#FFFFFF',
    lineHeight: hScale(19),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(4),
  },
  ratingText: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: 'rgba(255,255,255,0.85)',
  },
});
