import createAPIClient from '@/services/api';
import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Toast } from 'toastify-react-native';
import styles from '../styles/components/OrderCardKitchen.styles';

interface OrderedItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface OrderCardKitchenrops {
    id: string;
    customer: User;
    waitress: User;
    orderNumber: string;
    orderedItems: OrderedItem[];
    totalPrice: number;
    status: string;
    paymentStatus: string;
    orderDate: string;
    onPress: () => void;
}

const OrderCardKitchen = ({
    id,
    customer,
    waitress,
    orderNumber,
    orderedItems,
    totalPrice,
    status,
    paymentStatus,
    orderDate,
    onPress,
}: OrderCardKitchenrops) => {

const getStatusColor = () => {
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
};

const getProgressWidth = () => {
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
};

const api = useMemo(() => createAPIClient(), []);

const handleInProgressOrder = async(orderId : string) =>{
    api.patch(`/orders/in-progress/${orderId}`)
    .then(() => {
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Order marked as in progress',
            position: 'top',
            backgroundColor: '#4CAF50',
            textColor: '#FFFFFF',
        });
    }).catch((error) => {
        const errorMessage = error.response?.data || error.message || 'Failed to start order';
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to start order',
            position: 'top',
            backgroundColor: '#871919ff',
            textColor: '#FFFFFF',
        });
    });
} 

const handleCompleteOrder = async (orderId: string) => {
    api.patch(`/orders/complete/${orderId}`).then(() => {
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Order marked as completed',
            position: 'top',
            backgroundColor: '#4CAF50',
            textColor: '#FFFFFF',
        });
    }).catch((error) => {
        const errorMessage = error.response?.data || error.message || 'Failed to complete order';
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: typeof errorMessage === 'string' ? errorMessage : 'Failed to complete order',
            position: 'top',
            backgroundColor: '#871919ff',
            textColor: '#FFFFFF',
        });
    });
} 

    const isInProgress = status === 'IN_PROGRESS';
    const isCompleted = status === 'COMPLETED';
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
            </View>

            {!waitress ? (
                <View>
                    <Text style={styles.orderNumber}>Customer: {customer?.firstName} {customer?.lastName}</Text>
                </View>
            ) : (
                <View>
                    <Text style={styles.orderNumber}>Waitress: {waitress?.firstName} {waitress?.lastName}</Text>
                </View>
                
            )}

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <View style={styles.statusText}>
                    <Text style={{ 
                        color: getStatusColor(),
                        fontWeight: 'bold'
                    }}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Text>
                </View>
                <View style={styles.progressBackground}>
                    <View style={[
                        styles.progressFill, 
                        { width: getProgressWidth(), backgroundColor: getStatusColor() }
                    ]} />
                </View>
            </View>
            
            {/* Order items preview */}
            <View style={styles.itemsContainer}>
                {orderedItems.map((item, index) => (
                    <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemQuantity}>{item.quantity}×</Text>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    </View>
                ))}
            </View>

            
            
            {/* Footer with total */}
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => handleInProgressOrder(id)}
                    style={[
                        styles.addButton,
                        isInProgress && { backgroundColor: '#ccc' }
                    ]}
                    disabled={isInProgress || isCompleted}
                >
                    <Text style={styles.addButtonText}>
                        {isInProgress ? 'In Progress' : 'Start Order'}
                    </Text>
                </TouchableOpacity>
                {isInProgress && (
                    <TouchableOpacity
                        onPress={() => handleCompleteOrder(id)}
                        style={[styles.addButton, { backgroundColor: '#2196F3', marginTop: 8 }]}
                    >
                        <Text style={styles.addButtonText}>Complete Order</Text>
                    </TouchableOpacity>
                )}
            </View>
                
                <View style={styles.paymentBadge}>
                    <Text style={styles.paymentText}>{new Date(orderDate).toLocaleTimeString()}</Text>
                </View>
            </TouchableOpacity>
        
    );
};

export default OrderCardKitchen;