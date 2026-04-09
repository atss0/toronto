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

interface HeroCardProps {
  title: string;
  subtitle?: string;
  tag?: string;
  imageSource?: ImageSourcePropType;
  onViewRoute?: () => void;
  onSave?: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({
  title,
  subtitle,
  tag = "Today's Plan",
  imageSource,
  onViewRoute,
  onSave,
}) => {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View>
      <View style={styles.card}>
        {imageSource ? (
          <Image source={imageSource} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
        )}

        <View style={[StyleSheet.absoluteFill, styles.scrimFull]} />
        <View style={styles.scrimBottom} />

        <View style={styles.tagBadge}>
          <Iconify icon="solar:magic-stick-3-bold" size={wScale(12)} color={colors.warning} />
          <Text style={styles.tagText}>{tag}</Text>
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onViewRoute} activeOpacity={0.85}>
              <Iconify icon="solar:map-arrow-right-bold" size={wScale(15)} color={colors.primary} />
              <Text style={styles.primaryBtnText}>View Route</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineBtn} onPress={onSave} activeOpacity={0.8}>
              <Iconify icon="solar:bookmark-linear" size={wScale(15)} color='#FFFFFF' />
              <Text style={styles.outlineBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HeroCard;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  card: {
    height: hScale(256),
    borderRadius: wScale(22),
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: colors.cardDark,
  },
  scrimFull: {
    backgroundColor: 'rgba(10,18,35,0.18)',
  },
  scrimBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(10,18,35,0.72)',
    borderTopLeftRadius: wScale(40),
    borderTopRightRadius: wScale(40),
  },
  tagBadge: {
    position: 'absolute',
    top: hScale(16),
    left: wScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(5),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(5),
    borderRadius: wScale(20),
  },
  tagText: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wScale(20),
    paddingBottom: hScale(20),
    gap: hScale(14),
  },
  title: {
    fontSize: wScale(20),
    fontFamily: Fonts.plusJakartaSansExtraBold,
    color: '#FFFFFF',
    lineHeight: hScale(28),
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: wScale(12),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: hScale(17),
    marginTop: -hScale(8),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: wScale(10),
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(6),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wScale(18),
    paddingVertical: hScale(10),
    borderRadius: wScale(24),
  },
  primaryBtnText: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: colors.primary,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(6),
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: wScale(18),
    paddingVertical: hScale(10),
    borderRadius: wScale(24),
  },
  outlineBtnText: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: '#FFFFFF',
  }
});
