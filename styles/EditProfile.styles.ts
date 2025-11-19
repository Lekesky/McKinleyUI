import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: '#ffffffff',
        flex: 1,
        padding: 16,
    },
    header: {
        marginTop: 30,
        position: "absolute",
        top: 20,
        left: 20,
        marginBottom: "30%",
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
    updatePasswordButton: { 
        backgroundColor: '#871919ff', 
        marginTop: 20, 
        height: 58, 
        borderRadius: 30, 
        justifyContent: 'center',
        alignItems: 'center' 
    },
    updateProfileForm: {
        alignSelf: 'center',
        width: isWeb ? 1000 : '100%',
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 5,
        marginLeft: 15,
    },
    textInput: { 
        marginBottom: 15, 
        backgroundColor: '#e8e8e8ff', 
        height: 58 
    },
    textInputDisable: {
        marginBottom: 15, 
        backgroundColor: '#aeaeaeff', 
        height: 58 
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
        maxWidth: 100,
    },
    phoneNumberInput: {
        flex: 3,
    },
});

export default styles;