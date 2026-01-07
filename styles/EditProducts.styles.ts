import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#ffffff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#ffffff',
        marginBottom: 0
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
        paddingTop: 20
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333333',
        fontFamily: 'Helvetica',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    input: { 
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        height: 56,
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    descriptionInput: {
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        textAlignVertical: 'top',
        minHeight: 120,
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 0,
        marginBottom: 16,
        color: '#333333',
        fontFamily: 'Helvetica',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    imageSection: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2
    },
    imageLabel: {
        fontSize: 14,
        marginBottom: 12,
        fontWeight: '600',
        fontFamily: 'Helvetica',
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    imagePreview: {
        width: '100%',
        maxWidth: 300,
        height: 300,
        borderRadius: 8,
        marginBottom: 0
    },
    noImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#d0d0d0'
    },
    noImageText: {
        color: '#999999',
        fontSize: 14,
        fontFamily: 'Helvetica',
        fontWeight: '500'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12
    },
    imageButton: {
        flex: 1,
        marginHorizontal: 0,
        marginBottom: 0,
        borderRadius: 30,
        height: 50,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },
    actionButtonsContainer: {
        marginTop: 30,
        marginBottom: 40
    },
    deleteButton: { 
        marginTop: 0, 
        marginBottom: 16, 
        backgroundColor: '#dc3545',
        borderRadius: 30,
        height: 56,
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3
    },
    saveButton: { 
        marginTop: 0,
        marginBottom: 10,
        borderRadius: 30,
        height: 56,
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3
    },
    snackbar: {
        bottom: 20,
        backgroundColor: '#333333',
        borderRadius: 10
    }
});

export default styles;