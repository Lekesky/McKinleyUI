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
    personalInfo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: "5%"
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    button: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: "#F0F0F0",
        color: "#000000ff",
        borderRadius: 8,
        width: "90%",
    },
    adminButton: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: "#ed8080ff",
        color: "#000000ff",
        borderRadius: 8,
        width: "90%",
    },
    buttonContent: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: '#000000ff',
    },
    edgeIcons: {
        flex: 1,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonText: {
        fontFamily: "helvetica",
    },
    firstLastName: { 
        textAlign: 'center',
        fontSize: 28, 
        fontWeight: 'bold', 
        fontFamily: 'Helvetica',
    },
    email: {
        textAlign: 'center',
        fontSize: 16,
        color: '#7e7d7dff',
        fontFamily: 'Helvetica',
        marginBottom: 20,
    },
    timeJoined: {
        textAlign: 'center',
        fontSize: 16,
        color: '#7e7d7dff',
        fontFamily: 'Helvetica',
        marginBottom: 20,
    }
});

export default styles;