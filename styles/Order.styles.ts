import { Platform, StyleSheet } from "react-native";

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#ffffffff' 
    },
    header: {
        marginTop: 30,
        marginBottom: "1%",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    headerTitle: {
        fontSize: 24,
        color: '#871919ff',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
    },
    backButton: { 
        backgroundColor: '#e8e8e8ff', 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    viewController: {
        alignSelf: "center",
        marginTop: isWeb ? "1.5%" : "15%",
    }
});

export default styles;