import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#ffffffff' 
    },
    header: { 
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
    modalButtonPause: {
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