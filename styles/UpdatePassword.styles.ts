import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    container: { 
        justifyContent: 'center',
        flex: 1, 
        padding: 20,
        backgroundColor: '#ffffffff',
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                padding: 16,
            },
        }),
    },
    header: {
        position: 'absolute',
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
    profileTitle: {
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
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                height: 52,
                marginTop: 16,
            },
        }),
    },
    updatePasswordForm: {
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
    requirements: {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        paddingLeft: 8,
        marginBottom: 14,
    },
    requirementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 4,
    },
    requirementIcon: {
        marginRight: 8,
    },
    requirementText: {
        fontSize: 14,
        color: '#374151',
    },
    textInput: { 
        marginBottom: 15, 
        backgroundColor: '#e8e8e8ff', 
        borderRadius: 30,
    },
    textInputOutline: { 
        borderRadius: 30, 
        borderWidth: 0 
    },
    customSuccessToast: {
        width: '90%',
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    customToast: {
        width: '90%',
        backgroundColor: '#673AB7',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    customTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    customMessage: {
        color: '#fff',
        fontSize: 14,
        marginTop: 4,
    },
});

export default styles;