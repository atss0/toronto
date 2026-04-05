import { StyleSheet } from "react-native";
import Colors from "../../styles/Colors";
import { wScale, hScale } from "../../styles/Scaler";

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: wScale(12),
        marginBottom: hScale(32),
    },
    socialButton: {
        flex: 1,
        backgroundColor: Colors.white,
        borderColor: Colors.stroke,
    },
});
