import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Iconify } from 'react-native-iconify';
import Colors from '../../styles/Colors';
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
  const completed = totalStops - remaining;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      {/* Harita alanı */}
      <View style={styles.mapArea}>
        {/* Grid */}
        {[1, 2, 3].map(i => (
          <View key={`h${i}`} style={[styles.gridH, { top: `${25 * i}%` as any }]} />
        ))}
        {[1, 2, 3].map(i => (
          <View key={`v${i}`} style={[styles.gridV, { left: `${25 * i}%` as any }]} />
        ))}

        {/* Rota */}
        <View style={styles.routeTrack} />
        <View style={[styles.routeFill, { width: `${progress * 70}%` as any }]} />

        {/* Noktalar */}
        <View style={styles.dotStart}>
          <View style={styles.dotStartInner} />
        </View>
        <View style={styles.dotEnd}>
          <Iconify icon="solar:map-point-bold" size={wScale(20)} color={Colors.primary} />
        </View>

        {/* Etiket */}
        <View style={styles.mapLabel}>
          <Text style={styles.mapLabelText}>Route Map</Text>
        </View>
      </View>

      {/* Bilgi */}
      <View style={styles.info}>
        {/* Başlık satırı */}
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

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>
        <Text style={styles.progressLabel}>
          {completed} of {totalStops} stops completed
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Iconify icon="solar:map-point-wave-linear" size={wScale(14)} color={Colors.primary} />
            <Text style={styles.statText}>{remaining} remaining</Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.statItem}>
            <Iconify icon="solar:clock-circle-linear" size={wScale(14)} color={Colors.primary} />
            <Text style={styles.statText}>{duration}</Text>
          </View>
          {distance && (
            <>
              <View style={styles.dot} />
              <View style={styles.statItem}>
                <Iconify icon="solar:route-linear" size={wScale(14)} color={Colors.primary} />
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wScale(20),
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },

  // Harita
  mapArea: {
    height: hScale(120),
    backgroundColor: '#EFF6FF',
    overflow: 'hidden',
  },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#BFDBFE',
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#BFDBFE',
  },
  routeTrack: {
    position: 'absolute',
    top: '38%',
    left: '12%',
    right: '12%',
    height: 3,
    backgroundColor: '#BFDBFE',
    borderRadius: 2,
  },
  routeFill: {
    position: 'absolute',
    top: '38%',
    left: '12%',
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  dotStart: {
    position: 'absolute',
    top: '28%',
    left: '10%',
    width: wScale(14),
    height: wScale(14),
    borderRadius: wScale(7),
    backgroundColor: Colors.white,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotStartInner: {
    width: wScale(5),
    height: wScale(5),
    borderRadius: wScale(3),
    backgroundColor: Colors.primary,
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
    backgroundColor: 'rgba(49,130,237,0.12)',
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(3),
    borderRadius: wScale(8),
  },
  mapLabelText: {
    fontSize: wScale(10),
    fontFamily: Fonts.plusJakartaSansMedium,
    color: Colors.primary,
  },

  // Bilgi
  info: {
    padding: wScale(16),
    gap: hScale(10),
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
    color: Colors.textPrimary,
    lineHeight: hScale(21),
  },
  description: {
    fontSize: wScale(12),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textSecondary,
    lineHeight: hScale(17),
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wScale(5),
    backgroundColor: Colors.successLight,
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(4),
    borderRadius: wScale(20),
  },
  activePulse: {
    width: wScale(6),
    height: wScale(6),
    borderRadius: wScale(3),
    backgroundColor: Colors.success,
  },
  activeText: {
    fontSize: wScale(10),
    fontFamily: Fonts.plusJakartaSansBold,
    color: Colors.success,
    letterSpacing: 0.4,
  },

  // Progress
  progressTrack: {
    height: hScale(4),
    backgroundColor: Colors.inputBackground,
    borderRadius: hScale(2),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: hScale(2),
  },
  progressLabel: {
    fontSize: wScale(11),
    fontFamily: Fonts.plusJakartaSansRegular,
    color: Colors.textSecondary,
    marginTop: -hScale(4),
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
    color: Colors.textSecondary,
  },
  dot: {
    width: wScale(3),
    height: wScale(3),
    borderRadius: wScale(2),
    backgroundColor: Colors.stroke,
  },
});
