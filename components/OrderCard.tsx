import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import styles from '../styles/components/OrderCard.styles';

interface OrderedItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface OrderCardProps {
    id: string;
    orderNumber: string;
    orderedItems: OrderedItem[];
    totalPrice: number;
    status: string;
    paymentStatus: string;
    orderDate: string;
    onPress: () => void;
}

const OrderCard = React.memo(({
    id,
    orderNumber,
    orderedItems,
    totalPrice,
    status,
    paymentStatus,
    orderDate,
    onPress,
}: OrderCardProps) => {

    const statusColor = useMemo(() => {
        switch (status.toUpperCase()) {
            case 'COMPLETED':
                return '#22C55E'; // Green
            case 'CANCELED':
                return '#EF4444'; // Red
            case 'PENDING':
                return '#F59E0B'; // Orange/Amber
            case 'IN-PROGRESS':
                return '#3B82F6'; // Blue
            default:
                return '#b6b6b6ff'; // Gray
        }
    }, [status]);

    const progressWidth = useMemo(() => {
        switch (status.toUpperCase()) {
            case 'COMPLETED':
                return '100%';
            case 'CANCELED':
                return '100%';
            case 'PENDING':
                return '50%';
            case 'IN-PROGRESS':
                return '75%';
            default:
                return '0%';
        }
    }, [status]);

    const paymentStatusColor = useMemo(() => {
        switch (paymentStatus.toUpperCase()) {
            case 'PAID':
                return '#22C55E'; // Green
            case 'PENDING':
                return '#F59E0B'; // Orange/Amber
            default:
                return '#b6b6b6ff';
        }
    }, [paymentStatus]);


    // Display only the first 2 items with a "+X more" if there are more
    const displayItems = useMemo(() => orderedItems.slice(0, 2), [orderedItems]);
    const remainingItemsCount = orderedItems.length - displayItems.length;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
            </View>
            
            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <View style={styles.statusText}>
                    <Text style={{ 
                        color: statusColor,
                        fontWeight: 'bold'
                    }}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Text>
                </View>
                <View style={styles.progressBackground}>
                    <View style={[
                        styles.progressFill, 
                        { width: progressWidth, backgroundColor: statusColor }
                    ]} />
                </View>
            </View>
            
            {/* Order items preview */}
            <View style={styles.itemsContainer}>
                {displayItems.map((item, index) => (
                    <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemQuantity}>{item.quantity}×</Text>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                ))}
                
                {remainingItemsCount > 0 && (
                    <Text style={styles.moreItems}>+{remainingItemsCount} more items</Text>
                )}
            </View>
            
            {/* Footer with total */}
            <View style={styles.footer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>
            
            {paymentStatus !== 'COMPLETED' && (
                <View style={[styles.paymentBadge, { backgroundColor: paymentStatusColor + '33' }]}>
                    <Text style={styles.paymentText}>{paymentStatus}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
});

export default OrderCard;