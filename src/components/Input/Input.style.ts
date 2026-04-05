import { StyleSheet } from 'react-native';
import Colors from '../../styles/Colors';
import Fonts from '../../styles/Fonts';
import { wScale, hScale } from '../../styles/Scaler';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: hScale(16),
  },
  label: {
    fontSize: wScale(13),
    fontFamily: Fonts.plusJakartaSansSemiBold,
    color: Colors.textPrimary,
    marginBottom: hScale(8),
    letterSpacing: 0.1,
  },
  labelError: {
    color: Colors.danger,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.stroke,
    borderRadius: wScale(12),
    minHeight: hScale(52),
    paddingHorizontal: wScale(14),
    // Shadow — ekrandan beyaz olarak ayrışır
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  inputWrapperFocused: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.white,
    shadowColor: Colors.danger,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputWrapperDisabled: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.stroke,
    opacity: 0.55,
    elevation: 0,
    shadowOpacity: 0,
  },
  input: {
    flex: 1,
    fontSize: wScale(15),
    color: Colors.textPrimary,
    fontFamily: Fonts.plusJakartaSansRegular,
    paddingVertical: 0,
    minHeight: hScale(52),
  },
  leftIcon: {
    marginRight: wScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    marginLeft: wScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: wScale(12),
    color: Colors.danger,
    marginTop: hScale(5),
    fontFamily: Fonts.plusJakartaSansRegular,
  },
});

export default styles;
