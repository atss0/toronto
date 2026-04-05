import { StyleSheet } from "react-native";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { wScale, hScale } from "../../styles/Scaler";

export default StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        marginBottom: hScale(28),
    },
    titleSection: {
        alignSelf: 'stretch',
    },
    title: {
        fontSize: wScale(26),
        fontFamily: Fonts.plusJakartaSansExtraBold,
        color: Colors.textPrimary,
        marginBottom: hScale(6),
        letterSpacing: -0.3,
        lineHeight: hScale(34),
    },
    subtitle: {
        fontSize: wScale(14),
        color: Colors.textSecondary,
        fontFamily: Fonts.plusJakartaSansRegular,
        lineHeight: hScale(21),
        letterSpacing: 0.1,
    },
    // Aşağıdaki stiller logo/app-name alanı için hazır (kullanılmıyor)
    topSection: {
        alignItems: 'center',
        marginBottom: hScale(40),
    },
    logoBox: {
        width: wScale(48),
        height: wScale(48),
        backgroundColor: Colors.primary,
        borderRadius: wScale(14),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hScale(14),
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    appName: {
        fontSize: wScale(18),
        fontFamily: Fonts.plusJakartaSansBold,
        color: Colors.textPrimary,
        marginBottom: hScale(4),
    },
    appSlogan: {
        fontSize: wScale(13),
        color: Colors.textSecondary,
        fontFamily: Fonts.plusJakartaSansMedium,
    },
});
