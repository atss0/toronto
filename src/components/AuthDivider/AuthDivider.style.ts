import { StyleSheet } from "react-native";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { wScale, hScale } from "../../styles/Scaler";

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hScale(24),
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.stroke,
    },
    text: {
        marginHorizontal: wScale(14),
        color: Colors.textSecondary,
        fontSize: wScale(11),
        fontFamily: Fonts.plusJakartaSansMedium,
        letterSpacing: 1.2,
    },
});
