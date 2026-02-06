import { Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#ffffff',
        marginBottom: 0,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                paddingHorizontal: 16,
                paddingBottom: 16,
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
        marginRight: 16,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                width: 44,
                height: 44,
                marginRight: 12,
            },
        }),
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#871919ff',
        fontFamily: 'Helvetica',
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                fontSize: 20,
            },
        }),
    },
    formContainer: {
        padding: 20,
        paddingTop: 20,
        ...(isWeb && {
            // @ts-ignore
            '@media (max-width: 768px)': {
                padding: 16,
            },
        }),
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
        // color: '#4e4e4eff',
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
    buttonText :{
        color: "#fff",
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'Helvetica'
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
    featuredSection: {
        marginTop: 20,
        marginBottom: 20
    },
    featuredButton: {
        marginTop: 8,
        borderRadius: 30,
        height: 56,
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3
    },
    tagsSection: {
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
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
        minHeight: 50
    },
    tagChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#871919ff',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        gap: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    tagText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Helvetica'
    },
    noTagsText: {
        color: '#999999',
        fontSize: 14,
        fontFamily: 'Helvetica',
        fontStyle: 'italic',
        alignSelf: 'center',
        marginVertical: 10
    },
    addTagContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        marginBottom: 20
    },
    tagInput: {
        flex: 1,
        backgroundColor: '#ffffff',
        height: 48,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 24
    },
    addTagButton: {
        borderRadius: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },
    saveTagsButton: {
        marginTop: 8,
        borderRadius: 30,
        height: 56,
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3
    },
    sidesSection: {
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
    sidesContainer: {
        flexDirection: 'column',
        gap: 10,
        marginBottom: 20,
        minHeight: 50
    },
    sideChip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#871919ff',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    sideChipContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        gap: 12
    },
    sideText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Helvetica',
        flex: 1
    },
    sidePrice: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
        fontFamily: 'Helvetica'
    },
    noSidesText: {
        color: '#999999',
        fontSize: 14,
        fontFamily: 'Helvetica',
        fontStyle: 'italic',
        alignSelf: 'center',
        marginVertical: 10
    },
    addSideButton: {
        borderRadius: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: 12
    },
    availableSidesContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    availableSidesLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
        fontFamily: 'Helvetica',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    sidesSearchInput: {
        marginBottom: 12,
        backgroundColor: '#ffffff',
        height: 48,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 24
    },
    availableSideItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 8,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2
    },
    availableSideContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        gap: 12
    },
    availableSideName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
        fontFamily: 'Helvetica',
        flex: 1
    },
    availableSidePrice: {
        fontSize: 13,
        fontWeight: '600',
        color: '#871919ff',
        fontFamily: 'Helvetica'
    },
    noAvailableSidesText: {
        color: '#999999',
        fontSize: 13,
        fontFamily: 'Helvetica',
        fontStyle: 'italic',
        alignSelf: 'center',
        marginVertical: 10
    },
    loadingText: {
        color: '#666666',
        fontSize: 13,
        fontFamily: 'Helvetica',
        alignSelf: 'center',
        marginVertical: 10
    },
    viewMoreButton: {
        marginTop: 12,
        borderRadius: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3
    },
    snackbar: {
        bottom: 20,
        backgroundColor: '#333333',
        borderRadius: 10
    }
});

export default styles;