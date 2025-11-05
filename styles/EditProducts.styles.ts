import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#ffffffff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#ffffffff',
        marginBottom: "1%"
    },
    backButton: { 
        backgroundColor: '#e8e8e8ff', 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 16
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#871919ff',
        fontFamily: 'Helvetica'
    },
    formContainer: {
        padding: 20,
        paddingTop: 10
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        color: '#3c3c3cff',
        fontFamily: 'Helvetica'
    },
    input: { 
        marginBottom: 20,
        backgroundColor: '#e8e8e8ff',
        height: 58
    },
    descriptionInput: {
        marginBottom: 20,
        backgroundColor: '#e8e8e8ff',
        textAlignVertical: 'top',
        minHeight: 120
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 15,
        color: '#871919ff',
        fontFamily: 'Helvetica'
    },
    imageSection: {
        marginTop: 15,
        marginBottom: 25,
        backgroundColor: '#ffffffff',
        borderRadius: 20,
        padding: 15
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#f9f9f9',
        elevation: 2
    },
    imageLabel: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '500',
        fontFamily: 'Helvetica',
        color: '#871919ff'
    },
    imagePreview: {
        width: 250,
        height: 250,
        borderRadius: 25,
        marginBottom: 10
    },
    noImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        backgroundColor: '#f9f9f9',
        borderRadius: 25,
        marginBottom: 20,
        elevation: 1
    },
    noImageText: {
        color: '#888888',
        fontSize: 16,
        fontFamily: 'Helvetica'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    imageButton: {
        flex: 1,
        marginHorizontal: 5,
        marginBottom: 15,
        borderRadius: 30,
        height: 58
    },
    actionButtonsContainer: {
        marginTop: 20,
        marginBottom: 40
    },
    deleteButton: { 
        marginTop: 10, 
        marginBottom: 15, 
        backgroundColor: '#DF2935',
        borderRadius: 30,
        height: 58,
        justifyContent: 'center'
    },
    saveButton: { 
        marginTop: 5,
        marginBottom: 10,
        borderRadius: 30,
        height: 58,
        justifyContent: 'center'
    },
    snackbar: {
        bottom: 20,
        backgroundColor: '#3c3c3cff',
        borderRadius: 20
    }
});

export default styles;