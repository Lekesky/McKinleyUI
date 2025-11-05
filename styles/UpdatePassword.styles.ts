import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20,
        backgroundColor: '#ffffffff' 
    },
    header: {
        marginTop: 30,
        marginBottom: "30%",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    profileTitle: {
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
    updatePasswordForm: {
        marginTop: 10,
    },
    textInput: { 
        marginBottom: 15, 
        backgroundColor: '#e8e8e8ff', 
        height: 58 
    },
    textInputOutline: { 
        borderRadius: 30, 
        borderWidth: 0 
    },
});

export default styles;