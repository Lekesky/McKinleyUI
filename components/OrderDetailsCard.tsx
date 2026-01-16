import { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/components/OrderDetailsCard.styles';

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
    const getStatusStyle = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return styles.pending;
            case 'COMPLETED':
                return styles.completed;
            case 'IN-PROGRESS':
            case 'IN_PROGRESS':
                return styles.inProgress;
            case 'CANCELED':
                return styles.canceled;
            case 'PAID':
                return styles.paid;
            default:
                return styles.pending;
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.header}>
                <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusLabel}>Order Status</Text>
                    <Text style={[styles.status, getStatusStyle(status)]}>
                        {status}
                    </Text>
                </View>
            </View>
            <View style={styles.items}>
                {orderedItems.map((item) => (
                    <View key={item.id} style={styles.itemContainer}>
                        <Text style={styles.itemName} numberOfLines={2}>
                            {item.name}
                        </Text>
                        <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.paymentContainer}>
                    <Text style={styles.paymentLabel}>Payment</Text>
                    <Text style={[styles.paymentStatus, getStatusStyle(paymentStatus)]}>
                        {paymentStatus}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderDetailsCard;