import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/Components/OrderDetailsCard.styles';

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

export default OrderDetailsCard;