import { Platform, StyleSheet } from "react-native";

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#ffffffff',
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                paddingHorizontal: 16,
            },
        }),
    },
    header: {
        marginBottom: "1%",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                gap: 12,
            },
        }),
    },
    headerTitle: {
        fontSize: 24,
        color: '#871919ff',
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                fontSize: 20,
            },
        }),
    },
    backButton: { 
        backgroundColor: '#e8e8e8ff', 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center',
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                width: 44,
                height: 44,
            },
        }),
    },
    viewController: {
        alignSelf: "center",
        marginTop: isWeb ? "1.5%" : 15,
    }
});

export default styles;