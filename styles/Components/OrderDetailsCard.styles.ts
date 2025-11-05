import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    pending: {
        color: '#FFA500', // Orange for pending
    },
    completed: {
        color: '#4CAF50', // Green for completed
    },
    items: {
        marginBottom: 10,
    },
    itemText: {
        fontSize: 14,
        color: '#555',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    paymentStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default styles;