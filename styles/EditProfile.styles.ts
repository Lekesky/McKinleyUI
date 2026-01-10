import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        flex: 1,
        padding: 16,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                padding: 12,
            },
        }),
    },
    header: {
        position: "absolute",
        top: 20,
        left: 20,
        marginBottom: "30%",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                top: 16,
                left: 16,
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
    updatePasswordButton: { 
        backgroundColor: '#871919ff', 
        marginTop: 20, 
        height: 58, 
        borderRadius: 30, 
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        shadowColor: '#871919ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                height: 52,
                marginTop: 16,
            },
        }),
    },
    updateProfileForm: {
        alignSelf: 'center',
        width: isWeb ? '100%' : '100%',
        maxWidth: isWeb ? 600 : undefined,
        marginTop: 10,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                maxWidth: '100%',
            },
        }),
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: Platform.OS === 'web' ? 0 : 60,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 3,
        borderColor: '#871919ff',
    },
    avatarLabel: {
        marginTop: 12,
        fontSize: 20,
        fontWeight: '600',
        color: '#871919ff',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#871919ff',
        marginBottom: 12,
        marginTop: 8,
        marginLeft: 4,
    },
    buttonContainer: {
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 5,
        marginLeft: 15,
    },
    textInput: { 
        marginBottom: 15, 
        backgroundColor: '#f8f8f8', 
        height: 58,
    },
    textInputDisable: {
        marginBottom: 15, 
        backgroundColor: '#e8e8e8', 
        height: 58,
        opacity: 0.7,
    },
    textInputOutline: { 
        borderRadius: 30, 
        // borderWidth: 0 
    },
    phoneNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dialingCodeInput: {
        flex: 1,
        maxWidth: 120,
    },
    dialingCodeButton: {
        backgroundColor: '#f8f8f8',
        borderRadius: 30,
        height: 58,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minWidth: 120,
        borderWidth: 1,
        borderColor: 'rgba(135, 25, 25, 0.1)',
    },
    dialingCodeText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    menuContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        maxHeight: 300,
    },
    menuScrollView: {
        maxHeight: 300,
    },
    menuItemText: {
        fontSize: 14,
        color: '#333',
    },
    selectedMenuItem: {
        fontSize: 14,
        color: '#871919ff',
        fontWeight: 'bold',
    },
    phoneNumberInput: {
        flex: 3,
    },
});

export default styles;