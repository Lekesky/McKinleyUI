import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OrderedItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface OrderCardProps {
    orderNumber: string;
    orderedItems: OrderedItem[];
    totalPrice: number;
    status: string;
    paymentStatus: string;
    onPress: () => void; // Callback for when the card is pressed
}

const OrderDetailsCard: FC<OrderCardProps> = ({ orderNumber, orderedItems, totalPrice, status, paymentStatus, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
                <Text style={[styles.status, status === 'PENDING' ? styles.pending : styles.completed]}>
                    {status}
                </Text>
            </View>
            <View style={styles.items}>
                {orderedItems.map((item) => (
                    <Text key={item.id} style={styles.itemText}>
                        {item.quantity}x {item.name} - ${item.price.toFixed(2)}
                    </Text>
                ))}
            </View>
            <View style={styles.footer}>
                <Text style={styles.totalPrice}>Total: ${totalPrice.toFixed(2)}</Text>
                <Text style={[styles.paymentStatus, paymentStatus === 'PENDING' ? styles.pending : styles.completed]}>
                    {paymentStatus}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

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

export default OrderDetailsCard;