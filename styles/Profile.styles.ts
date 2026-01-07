import { Platform, StyleSheet } from 'react-native';
const isweb = Platform.OS === 'web';

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: isweb ? 'center' : 'flex-start',
        padding: 20,
        backgroundColor: '#ffffffff' 
    },
    header: {
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
        color: "#000000ff",
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: "5%"
    },
    buttonContainer: {
        alignSelf: 'center',
        minWidth: isweb ? 800 : "100%",
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
    },
    edgeIcons: {
        flex: 1,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonText: {
        color: "#000000ff",
        fontFamily: "helvetica",
    },
    firstLastName: { 
        color: "#000000ff",
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
    },
    centeredModelView : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#871919ff",
    },
    modalButtonLogout: {
        backgroundColor: "#871919ff",
    },
    modalButtonCancel: {
        backgroundColor: "#6c6c6cff",
    },
    modalTextHeader: {
        color: "#000000ff",
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontFamily: 'Helvetica',
    },
    modalText: {
        color: "#000000ff",
        marginBottom: 30,
        textAlign: "center",
        fontSize: 14,
        fontFamily: 'Helvetica',
    },
    modalTextStyle: {
        color: "#ffffffff",
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: 'Helvetica',
    },
    modalButtonContainer: {
        flex: 1,
        justifyContent: "center",
        gap: 20,
        flexDirection: "row",
        width: "100%",
    },
    webModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

});

export default styles;