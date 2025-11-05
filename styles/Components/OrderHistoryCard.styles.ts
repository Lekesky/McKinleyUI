import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderDate: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    orderStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        textAlign: 'center',
        marginBottom: 4,
    },
    paymentStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        textAlign: 'center',
    },
    statusCompleted: {
        backgroundColor: '#d4f8d4',
        color: '#0a8f0a',
    },
    statusInProgress: {
        backgroundColor: '#fff8c2',
        color: '#8f7c0a',
    },
    statusCanceled: {
        backgroundColor: '#f8d4d4',
        color: '#8f0a0a',
    },
    statusPending: {
        backgroundColor: '#d4e6f8',
        color: '#0a5e8f',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    infoIconContainer: {
        marginRight: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#555',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    itemsList: {
        marginBottom: 15,
        marginLeft: 5,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    itemName: {
        fontSize: 14,
        color: '#444',
    },
    itemCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#871919ff',
        marginLeft: 5,
    },
    orderTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    totalPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#871919ff',
    },
    orderTimes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    timeInfo: {
        fontSize: 12,
        color: '#777',
    },
    emptyMessage: {
        padding: 15,
        textAlign: 'center',
        color: '#7e7d7dff',
        fontFamily: 'Helvetica',
    },
});

export default styles;