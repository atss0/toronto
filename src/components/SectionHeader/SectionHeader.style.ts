import { StyleSheet } from 'react-native';
import { AppColors } from '../../styles/theme';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';

export const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hScale(16),
    paddingHorizontal: wScale(24),
  },
  title: {
    fontSize: wScale(17),
    fontFamily: Fonts.plusJakartaSansBold,
    color: colors.textPrimary,
    letterSpacing: -0.1,
  },
  seeAll: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: colors.primary,
  },
});

// Geriye dönük uyumluluk için statik export (kullanılmıyorsa kaldırılabilir)
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hScale(16),
    paddingHorizontal: wScale(24),
  },
  title: {
    fontSize: wScale(17),
    fontFamily: Fonts.plusJakartaSansBold,
    color: Colors.textPrimary,
    letterSpacing: -0.1,
  },
  seeAll: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.primary,
  },
});
