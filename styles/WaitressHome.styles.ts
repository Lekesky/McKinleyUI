import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    waitressContainerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height - 250,
        paddingVertical: 20,
    },
    waitressContainer: {
        width: '90%',
        maxWidth: 500,
        paddingVertical: 30,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    waitressTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#871919ff',
        marginBottom: 30,
        fontFamily: 'Helvetica',
    },
    tableLayout: {
        width: '100%',
        marginVertical: 20,
        alignItems: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    tableButton: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    selectedTableButton: {
        backgroundColor: '#871919ff',
        borderColor: '#700000',
    },
    tableButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    selectedTableText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    selectedTableInfo: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    takeOrderButton: {
        backgroundColor: '#871919ff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 220,
        borderRadius: 30,
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    buttonIcon: {
        marginRight: 10,
    },
    takeOrderButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default styles;