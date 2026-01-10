import { Dimensions, ImageStyle, Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native';
const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create<{
    container: ViewStyle;
    loadingContainer: ViewStyle;
    backButton: ViewStyle;
    image: ImageStyle;
    contentContainer: ViewStyle;
    header: ViewStyle;
    name: TextStyle;
    price: TextStyle;
    divider: ViewStyle;
    descriptionTitle: TextStyle;
    description: TextStyle;
    quantityContainer: ViewStyle;
    quantityLabel: TextStyle;
    quantityControls: ViewStyle;
    quantityButton: ViewStyle;
    quantityText: TextStyle;
    bottomButtonContainer: ViewStyle;
    addToCartButton: ViewStyle;
    modalOverlay: ViewStyle;
    modalContent: ViewStyle;
    scrollContentWeb: ViewStyle;
    closeButton: ViewStyle;
    imageWeb: ImageStyle;
    contentContainerWeb: ViewStyle;
    addToCartButtonWeb: ViewStyle;
}>({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        zIndex: 10,
        backgroundColor: '#ffffffff',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                width: 44,
                height: 44,
                left: 16,
            },
        } as any),
    },
    image: {
        width: width,
        // height: width * 0.75,
        height: 530,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                height: 400,
            },
        } as any),
    },
    contentContainer: {
        marginTop: -35,
        height: "100%",
        padding: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderRadius: 35,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                padding: 16,
                borderRadius: 24,
            },
        } as any),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        color: '#000',
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                fontSize: 20,
            },
        } as any),
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#871919ff',
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                fontSize: 20,
            },
        } as any),
    },
    divider: {
        marginVertical: 15,
        backgroundColor: '#e0e0e0',
        height: 1,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                fontSize: 16,
            },
        } as any),
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                fontSize: 14,
                lineHeight: 20,
            },
        } as any),
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
        ...(isWeb && {
            '@media (max-width: 768px)': {
                marginVertical: 16,
            },
        } as any),
    },
    quantityLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                fontSize: 16,
            },
        } as any),
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        margin: 0,
        backgroundColor: '#f0f0f0',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
        minWidth: 24,
        textAlign: 'center',
        color: '#000',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                fontSize: 16,
                marginHorizontal: 8,
            },
        } as any),
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
        ...(isWeb && {
            '@media (max-width: 768px)': {
                paddingHorizontal: 16,
                paddingBottom: 24,
            },
        } as any),
    },
    addToCartButton: {
        paddingVertical: 8,
        backgroundColor: '#871919ff',
    },
    // Web-specific styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        maxWidth: 750,
        width: '100%',
        maxHeight: '85vh',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        overflow: 'hidden',
        ...(isWeb && {
            '@media (max-width: 768px)': {
                maxWidth: '95%',
                borderRadius: 16,
            },
        } as any),
    },
    scrollContentWeb: {
        flexGrow: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    imageWeb: {
        width: '100%',
        height: 400,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        ...(isWeb && {
            '@media (max-width: 768px)': {
                height: 300,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
            },
        } as any),
    },
    contentContainerWeb: {
        padding: 30,
        paddingBottom: 20,
        ...(isWeb && {
            '@media (max-width: 768px)': {
                padding: 20,
                paddingBottom: 16,
            },
        } as any),
    },
    addToCartButtonWeb: {
        marginTop: 25,
        paddingVertical: 8,
        backgroundColor: '#871919ff',
    },
});

export default styles;