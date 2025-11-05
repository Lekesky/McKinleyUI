import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#ffffffff' 
    },
    header: { 
        marginTop: 30, 
        marginBottom: 10, 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 20 
    },
    headerTitle: { 
        flex: 1, 
        fontSize: 24, 
        color: '#871919ff', 
        fontWeight: 'bold', 
        fontFamily: 'Helvetica' 
    },
    backButton: { 
        backgroundColor: '#e8e8e8ff', 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    subtitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#871919ff', 
        marginBottom: 10,
        marginTop: 15, 
        fontFamily: 'Helvetica' 
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
    buttonPrimary: { 
        backgroundColor: '#871919ff', 
        height: 50, 
        borderRadius: 25,
        justifyContent: 'center', 
        alignItems: 'center', 
        marginVertical: 10 
    },
    buttonText: { 
        color: '#FFFFFF', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
});

export default styles;