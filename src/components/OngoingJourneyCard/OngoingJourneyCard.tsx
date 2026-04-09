import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { useColors } from '../../context/ThemeContext';
import { AppColors } from '../../styles/theme';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';

interface OngoingJourneyCardProps {
  title: string;
  description?: string;
  remaining: number;
  totalStops?: number;
  duration: string;
  distance?: string;
  progress?: number;
  isActive?: boolean;
  onPress?: () => void;
}

const OngoingJourneyCard: React.FC<OngoingJourneyCardProps> = ({
  title,
  description,
  remaining,
  totalStops = 5,
  duration,
  distance,
  progress = 0.4,
  isActive = true,
  onPress,
}) => {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const completed = totalStops - remaining;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      {/* Harita alanı */}
      <View style={styles.mapArea}>
        {[1, 2, 3].map(i => (
          <View key={`h${i}`} style={[styles.gridH, { top: `${25 * i}%` as any }]} />
        ))}
        {[1, 2, 3].map(i => (
          <View key={`v${i}`} style={[styles.gridV, { left: `${25 * i}%` as any }]} />
        ))}

        <View style={styles.routeTrack} />
        <View style={[styles.routeFill, { width: `${progress * 70}%` as any }]} />

        <View style={styles.dotStart}>
          <View style={styles.dotStartInner} />
        </View>
        <View style={styles.dotEnd}>
          <Iconify icon="solar:map-point-bold" size={wScale(20)} color={colors.primary} />
        </View>

        <View style={styles.mapLabel}>
          <Text style={styles.mapLabelText}>Route Map</Text>
        </View>
      </View>

      {/* Bilgi */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {description ? (
              <Text style={styles.description} numberOfLines={1}>{description}</Text>
            ) : null}
          </View>
          {isActive && (
            <View style={styles.activeBadge}>
              <View style={styles.activePulse} />
              <Text style={styles.activeText}>ACTIVE</Text>
            </View>
          )}
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>
        <Text style={styles.progressLabel}>
          {completed} of {totalStops} stops completed
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Iconify icon="solar:map-point-wave-linear" size={wScale(14)} color={colors.primary} />
            <Text style={styles.statText}>{remaining} remaining</Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.statItem}>
            <Iconify icon="solar:clock-circle-linear" size={wScale(14)} color={colors.primary} />
            <Text style={styles.statText}>{duration}</Text>
          </View>
          {distance && (
            <>
              <View style={styles.dot} />
              <View style={styles.statItem}>
                <Iconify icon="solar:route-linear" size={wScale(14)} color={colors.primary} />
                <Text style={styles.statText}>{distance}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OngoingJourneyCard;

const makeStyles = (colors: AppColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: wScale(20),
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },

  // Harita
  mapArea: {
    height: hScale(120),
    backgroundColor: colors.mapBackground,
    overflow: 'hidden',
  },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.mapGrid,
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.mapGrid,
  },
  routeTrack: {
    position: 'absolute',
    top: '38%',
    left: '12%',
    right: '12%',
    height: 3,
    backgroundColor: colors.mapGrid,
    borderRadius: 2,
  },
  routeFill: {
    position: 'absolute',
    top: '38%',
    left: '12%',
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  dotStart: {
    position: 'absolute',
    top: '28%',
    left: '10%',
    width: wScale(14),
    height: wScale(14),
    borderRadius: wScale(7),
    backgroundColor: colors.white,
    borderWidth: 2.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotStartInner: {
    width: wScale(5),
    height: wScale(5),
    borderRadius: wScale(3),
    backgroundColor: colors.primary,
  },
  dotEnd: {
    position: 'absolute',
    top: '20%',
    right: '9%',
  },
  mapLabel: {
    position: 'absolute',
    bottom: hScale(8),
    left: wScale(12),
    backgroundColor: colors.primaryLight,
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(3),
    borderRadius: wScale(8),
  },
  mapLabelText: {
    fontSize: wScale(10),
    fontFamily: Fonts.plusJakartaSansMedium,
    color: colors.primary,
  },

  // Bilgi
  info: {
    padding: wScale(16),
    gap: hScale(8),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: wScale(8),
  },
  titleBlock: {
    flex: 1,
    gap: hScale(2),
  },
  title: {
    fontSize: wScale(15),
    fontFamily: Fonts.plusJakartaSansBold,
    color: colors.textPrimary,
    lineHeight: hScale(21),
  },
  description: {
    fontSize: wScale(12),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary,
    lineHeight: hScale(17),
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(5),
    backgroundColor: colors.successLight,
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(4),
    borderRadius: wScale(20),
  },
  activePulse: {
    width: wScale(6),
    height: wScale(6),
    borderRadius: wScale(3),
    backgroundColor: colors.success,
  },
  activeText: {
    fontSize: wScale(10),
    fontFamily: Fonts.plusJakartaSansBold,
    color: colors.success,
    letterSpacing: 0.4,
  },

  // Progress
  progressTrack: {
    height: hScale(4),
    backgroundColor: colors.inputBackground,
    borderRadius: hScale(2),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: hScale(2),
  },
  progressLabel: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: colors.textSecondary,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(8),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(4),
  },
  statText: {
    fontSize: wScale(12),
    fontFamily: Fonts.plusJakartaSansMedium,
    color: colors.textSecondary,
  },
  dot: {
    width: wScale(3),
    height: wScale(3),
    borderRadius: wScale(2),
    backgroundColor: colors.stroke,
  },
});
