import React from 'react';
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

export interface HeroStat {
  id: string;
  icon: string;
  label: string;
}

interface HeroCardProps {
  title: string;
  subtitle?: string;
  tag?: string;
  imageSource?: ImageSourcePropType;
  stats?: HeroStat[];
  onViewRoute?: () => void;
  onSave?: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({
  title,
  subtitle,
  tag = "Today's Plan",
  imageSource,
  stats = [],
  onViewRoute,
  onSave,
}) => {
  return (
    <View>
      {/* ── Kart ── */}
      <View style={styles.card}>
        {/* Fotoğraf */}
        {imageSource ? (
          <Image source={imageSource} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
        )}

        {/* Gradient simülasyonu — üst açık, alt koyu */}
        <View style={[StyleSheet.absoluteFill, styles.scrimFull]} />
        <View style={styles.scrimBottom} />

        {/* Üst sol: etiket */}
        <View style={styles.tagBadge}>
          <Iconify icon="solar:magic-stick-3-bold" size={wScale(12)} color={Colors.warning} />
          <Text style={styles.tagText}>{tag}</Text>
        </View>

        {/* Alt: metin + butonlar */}
        <View style={styles.bottomContent}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onViewRoute} activeOpacity={0.85}>
              <Iconify icon="solar:map-arrow-right-bold" size={wScale(15)} color={Colors.primary} />
              <Text style={styles.primaryBtnText}>View Route</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineBtn} onPress={onSave} activeOpacity={0.8}>
              <Iconify icon="solar:bookmark-linear" size={wScale(15)} color={Colors.white} />
              <Text style={styles.outlineBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Stat satırı — kartın altında, ayrı ── */}
      {stats.length > 0 && (
        <View style={styles.statsRow}>
          {stats.map(stat => (
            <View key={stat.id} style={styles.statChip}>
              <Iconify icon={stat.icon} size={wScale(14)} color={Colors.primary} />
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default HeroCard;

const styles = StyleSheet.create({
  card: {
    height: hScale(256),
    borderRadius: wScale(22),
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: Colors.cardDark,
  },

  // Gradient katmanları
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
    // borderTopLeftRadius ve borderTopRightRadius ile yumuşatma
    borderTopLeftRadius: wScale(40),
    borderTopRightRadius: wScale(40),
  },

  // Üst etiket
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
    color: Colors.white,
    letterSpacing: 0.2,
  },

  // Alt içerik
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
    color: Colors.white,
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
    backgroundColor: Colors.white,
    paddingHorizontal: wScale(18),
    paddingVertical: hScale(10),
    borderRadius: wScale(24),
  },
  primaryBtnText: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.primary,
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
    color: Colors.white,
  },

  // ── Stat satırı ──
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hScale(12),
    gap: wScale(8),
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    gap: hScale(5),
    backgroundColor: Colors.white,
    paddingVertical: hScale(10),
    borderRadius: wScale(14),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statLabel: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.textPrimary,
  },
});
