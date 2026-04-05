import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';

const styles = StyleSheet.create({
  // --- Temel Stiller ---
  baseContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wScale(14),
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontFamily: Fonts.plusJakartaSansSemiBold,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  leftIconWrapper: {
    marginRight: wScale(8),
  },
  rightIconWrapper: {
    marginLeft: wScale(8),
  },

  // --- Boyut Stilleri ---
  smallContainer: {
    paddingVertical: hScale(8),
    paddingHorizontal: wScale(14),
  },
  mediumContainer: {
    paddingVertical: hScale(12),
    paddingHorizontal: wScale(18),
  },
  largeContainer: {
    paddingVertical: hScale(15),
    paddingHorizontal: wScale(24),
  },

  smallText: { fontSize: wScale(13) },
  mediumText: { fontSize: wScale(15) },
  largeText: { fontSize: wScale(16) },

  // --- Varyant Stilleri ---
  primaryContainer: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    // Renkli gölge — modern CTA hissi
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  secondaryContainer: {
    backgroundColor: Colors.white,
    borderColor: Colors.stroke,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  outlineContainer: {
    backgroundColor: Colors.white,
    borderColor: Colors.stroke,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  dangerContainer: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  // --- Metin Renkleri ---
  primaryText: { color: Colors.white },
  secondaryText: { color: Colors.textPrimary },
  outlineText: { color: Colors.textPrimary },
  ghostText: { color: Colors.primary },
  dangerText: { color: Colors.white },

  // --- Tıklanma (Pressed) Stilleri ---
  primaryPressed: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowOpacity: 0.2,
  },
  secondaryPressed: { backgroundColor: Colors.inputBackground },
  outlinePressed: { backgroundColor: Colors.inputBackground },
  ghostPressed: { backgroundColor: `${Colors.primary}10` },
  dangerPressed: { backgroundColor: '#DC2626', borderColor: '#DC2626' },

  // --- Deaktif Stilleri ---
  disabledContainer: {
    backgroundColor: Colors.stroke,
    borderColor: Colors.stroke,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: Colors.textSecondary,
  },
});

export default styles;
