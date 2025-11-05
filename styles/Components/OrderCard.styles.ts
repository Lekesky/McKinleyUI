import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#871919ff',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    progressContainer: {
        marginBottom: 16,
    },
    statusText: {
        marginBottom: 4,
    },
    progressBackground: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
    },
    progressFill: {
        height: 6,
        borderRadius: 3,
    },
    itemsContainer: {
        marginBottom: 16,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 14,
        fontWeight: 'bold',
        width: 30,
        color: '#444',
    },
    itemName: {
        fontSize: 14,
        flex: 1,
        color: '#333',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    moreItems: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#871919ff',
    },
    paymentBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        // backgroundColor: '#f8d7da',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    paymentText: {
        fontSize: 10,
        fontWeight: 'bold',
    }
});

export default styles;